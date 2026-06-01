import { Badge, Button, Input, Label } from '@ielts/ui';
import { ChevronDown, Loader2, X } from 'lucide-react';
import {
  type Control,
  Controller,
  type FieldErrors,
  type UseFormSetValue,
  type UseFormWatch,
} from 'react-hook-form';
import { useTopicAutocomplete } from '../../hooks/useTopicAutocomplete';
import type { WordFormData } from '../../types';

interface TopicsFieldProps {
  control: Control<WordFormData>;
  error?: FieldErrors<WordFormData>['topics'];
  isOpen: boolean;
  setValue: UseFormSetValue<WordFormData>;
  watch: UseFormWatch<WordFormData>;
}

export function TopicsField({ control, error, isOpen, setValue, watch }: TopicsFieldProps) {
  const {
    topicInput,
    setTopicInput,
    showSuggestions,
    setShowSuggestions,
    filteredTopics,
    setUserHasTyped,
    topicInputRef,
    isTopicsLoading,
    handleTopicSelect,
    handleTopicInputKeyDown,
    handleRemoveTopic,
  } = useTopicAutocomplete({ isOpen, setValue, watch });

  return (
    <div className="relative w-full space-y-2">
      <Label className="text-sm font-semibold">Topics (Select at least one) *</Label>

      <Controller
        name="topics"
        control={control}
        rules={{
          validate: (value) =>
            value && value.length > 0 ? true : 'At least one topic must be selected',
        }}
        render={({ field }) => (
          <>
            {/* Display selected topics */}
            {field.value && field.value.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {field.value.map((topicName) => (
                  <Badge
                    key={topicName}
                    variant="secondary"
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-foreground bg-secondary/80 border border-border"
                  >
                    <span>{topicName}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleRemoveTopic(topicName)}
                      className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full p-0 h-4 w-4 flex items-center justify-center transition-colors"
                      aria-label={`Remove topic ${topicName}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="relative">
              <Input
                ref={topicInputRef}
                value={topicInput}
                onChange={(e) => {
                  setTopicInput(e.target.value);
                  setUserHasTyped(true);
                }}
                onKeyDown={handleTopicInputKeyDown}
                placeholder="Type to search and add topics... (Press Enter to add)"
                autoComplete="off"
                onFocus={() => {
                  setShowSuggestions(true);
                  setUserHasTyped(false);
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className={`pr-10 ${
                  error ? 'border-destructive focus-visible:ring-destructive' : ''
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                <ChevronDown size={16} />
              </div>
            </div>
          </>
        )}
      />
      {error && (
        <p className="text-xs text-destructive">{error.message}</p>
      )}

      {/* Topic Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute z-[150] w-full max-h-[200px] overflow-y-auto bg-card border border-border rounded-lg mt-1.5 shadow-lg">
          {isTopicsLoading && (
            <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
              <Loader2 size={16} className="animate-spin text-primary" />
              <span>Loading topics...</span>
            </div>
          )}

          {!isTopicsLoading && filteredTopics.length === 0 && (
            <div className="p-3 text-sm text-muted-foreground">
              No matching topics. Press Enter to add "{topicInput}"
            </div>
          )}

          <div role="listbox" className="divide-y divide-border/40">
            {filteredTopics.map((topic) => (
              <div
                key={topic._id}
                role="option"
                aria-selected={false}
                tabIndex={0}
                onMouseDown={(e) => {
                  // Prevent onBlur from firing before click is processed
                  e.preventDefault();
                }}
                onClick={() => handleTopicSelect(topic.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTopicSelect(topic.name);
                  }
                }}
                className="px-4 py-2.5 text-sm text-foreground cursor-pointer hover:bg-muted focus:bg-muted focus:outline-none transition-colors"
              >
                {topic.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

