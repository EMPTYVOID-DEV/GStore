import { ComponentType, SvelteComponent } from "svelte";

// Type for the asyncButton action prop
export type asyncButtonAction = (ev: MouseEvent) => Promise<any>;

// Type for default checklist component
export type checkItem = {
  text: string;
  checked: boolean;
  disabled?: boolean;
  description?: string;
};

// Type for reactive input variant
export type reactiveInputStatus = {
  errorMsg: string;
  state: "idle" | "valid" | "invalid";
};

// Type for input change handlers
export type changeEvent<T> = Event & {
  currentTarget: EventTarget & T;
};

//type for input change handlers
export type inputChangeHandler<T> = (ev: changeEvent<T>) => void;

/** Event type for the change handler fired by the slider package.
 *  Contains a detail tuple representing the selected range.
 */
export type sliderEvent = (
  ev: Event & {
    currentTarget: EventTarget & HTMLInputElement;
  } & {
    detail: [number, number];
  }
) => void;

// Type for the default select variant change event
export type selectEvent = Event & {
  detail:
    | { value: any; label: string }[]
    | { value: any; label: string }
    | null;
};

// Type for the checkFunction prop - reactive input variant
export type checkFunction = (currentValue: string) => {
  state: "valid" | "invalid";
  errorMsg: string;
};

// Type for a search section
export type section = {
  link: string;
  sectionName: string;
  subSections?: {
    subSectionName: string;
    link: string;
    isHeader?: boolean;
  }[];
};

// Type for the siteSearch component
export type category = {
  categoryName: string;
  sections: section[];
};

// Type for the toast component
export type toastAction = {
  label: string;
  action: (ev: MouseEvent) => void;
};

// Type for the async toast variant
export type toastState = {
  header: string;
  description: string;
  toastAction: toastAction | null;
};
