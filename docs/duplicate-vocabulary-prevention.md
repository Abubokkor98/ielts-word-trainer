# Duplicate Vocabulary Prevention Guide

This document provides a comprehensive breakdown and architectural blueprint for preventing duplicate vocabulary words within the IELTS Vocabulary Trainer database. It explains the core issues, the impact, the rationale for solving them, the exact code review context from CodeRabbit, and the recommended engineering strategy to achieve robust duplicate prevention.

---

## 1. The Core Problem Breakdown

Currently, the vocabulary management system does not enforce strict case-insensitive or whitespace-trimmed uniqueness on the vocabulary words stored in the database. This opens the door to several significant data integrity and runtime issues.

### The Casing and Space Inconsistency
Users or administrators can create identical words with minor formatting variations. For example, the system might allow the insertion of "Important", "important", " important ", and "IMPORTANT" as separate documents in the database.

### Pre-Save Normalization Ambiguity
The word database schema contains a pre-save hook that automatically converts the word field to lowercase and trims any surrounding whitespace before saving. While this helps with consistent database storage, it introduces a critical lookup problem:
If multiple variations are sent to the database, they will all be saved as identical, lowercase, trimmed strings.
When the application performs a query like finding a word by its spelling (which relies on case-insensitive matches), the database engine will simply return the first matching document. The other duplicate documents will become permanently unreachable and orphaned, yet they will continue to occupy space and pollute search queries.

### Async Unique Index Failures
If the database schema is updated to enforce a unique constraint on the word field while duplicate entries already exist in the collection, MongoDB will silently fail to build the unique index during application startup. The server will keep running, but without the unique index active, future duplicate entries will continue to be allowed, defeating the purpose of the schema update.

---

## 2. Why We Should Solve This Problem

Enforcing duplicate prevention is vital for maintaining a healthy database and a predictable application state.

* **Reliable Spaced Repetition and Progress Tracking**: Spaced repetition, learning history, and user custom word lists refer to words by their database reference. If multiple copies of the same word exist, the user's learning progress will be split across multiple records. A user might successfully study "important" on one screen, but the system might ask them to study "Important" (a separate duplicate record) on another, reset their progress, or fail to count their points correctly.
* **Quiz and Question Validity**: The quiz system selects vocabulary words to generate questions. If duplicate entries exist, the quiz could present the same word multiple times, or offer options that are semantically identical, leading to a broken and confusing user experience.
* **Preventing Silent Failures**: Surfacing index-building failures immediately ensures that local development, staging, and production databases are kept in sync and that developer teams are instantly alerted to data corruption.

---

## 3. How It Benefits Us

Implementing this feature provides concrete advantages for developers, administrators, and end-users:

* **Guaranteed Data Consistency**: Every vocabulary word is represented by exactly one canonical document in the database, acting as the single source of truth.
* **Streamlined UI Experience**: The frontend will never display duplicate words in list views, library searches, or quiz selections.
* **Self-Documenting Error Boundaries**: Requests containing duplicate words will be intercepted early at the service and middleware layers. Instead of crashing the server or returning generic five-hundred server errors, the system will respond with highly informative four-hundred bad request validation errors.
* **Strict Application Architecture**: The code boundaries will be resilient, handling errors gracefully at both the application level and the database driver level.

---

## 4. The CodeRabbit Code Review Reference

During the pull request review, the CodeRabbit automated review tool flagged this exact architectural weakness with the following suggestion:

* **Potential Issue / Major / Heavy Lift**:
  Enforce unique constraint on the normalized word to prevent ambiguous lookups.
* **Analysis Chain**:
  The pre-save hook normalizes the word field by lowercasing and trimming, but the schema does not enforce uniqueness. The findById function performs an exact normalized equality lookup by querying Word.findOne with the lowercase and trimmed version of the string. If duplicates already exist, findOne can return an arbitrary document, making the others unreachable.
* **Suggested Direction**:
  Change the word schema field options from indexed string to a unique indexed string:

  ```diff
  -    word: { type: String, required: true, index: true },
  +    word: { type: String, required: true, index: true, unique: true },
  ```

  Additionally, add a migration or deduplication backfill script to clear existing normalized collisions in the database before creating the unique index on production.

---

## 5. Recommended Implementation Strategy

To successfully implement this feature in a future pull request without causing runtime compiler issues or silent database failures, the following layered engineering pattern is recommended:

### Layer A: Database Index Verification
During application initialization or model registration, subscribe to index creation events on the Word model. If MongoDB fails to create the unique index due to existing duplicates, log a clear error to the terminal so the operations team knows a deduplication script must be run.

### Layer B: Service-Level Validation Pre-Checks
Before saving a new word or modifying an existing one inside the Words Service, normalize the word input by trimming and converting it to lowercase. Run a case-insensitive check against the collection. If a matching document is found, immediately throw a validation error (for example, using a custom application error class) with a four-hundred status code, preventing the save operation from proceeding.

### Layer C: Global Database Error Mapping
In the Express global error handling middleware, add a strict check for MongoDB database server errors (specifically checking for error code eleven-thousand, which denotes duplicate key violations). If this error is intercepted, parse the key-value pairs of the violation, extract the duplicate field and value, and return a clean JSON response explaining that the entry already exists.

### Layer D: Data Deduplication Script
Create a simple utility script that runs before applying the unique index. This script should scan the database, group words by their lowercase and trimmed spelling, merge any duplicate documents (or retain the oldest one), and delete the redundant entries. Once clean, the unique index can be applied safely.
