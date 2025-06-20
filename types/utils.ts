// Utility types for the Meet application

// Basic utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type NonNullable<T> = T extends null | undefined ? never : T;

// Object utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Function utility types
export type AsyncFunction<T = any, R = any> = (...args: T[]) => Promise<R>;
export type SyncFunction<T = any, R = any> = (...args: T[]) => R;

// Event utility types
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// Form utility types
export type FormField<T = string> = {
  value: T;
  error?: string;
  touched: boolean;
  required?: boolean;
};

export type FormState<T> = {
  [K in keyof T]: FormField<T[K]>;
} & {
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
};

// API utility types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type ApiError = {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, any>;
};

export type ApiRequestConfig = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
};

// Component utility types
export type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never;

export type ForwardedRef<T> = React.ForwardedRef<T>;

export type ChildrenProps = {
  children?: React.ReactNode;
};

export type ClassNameProps = {
  className?: string;
};

export type CommonProps = ChildrenProps & ClassNameProps;

// State utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  status: LoadingState;
};

// Validation utility types
export type ValidationRule<T = any> = {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: T) => boolean | string;
};

export type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};

// Socket utility types
export type SocketEventMap = {
  connect: () => void;
  disconnect: (reason: string) => void;
  error: (error: Error) => void;
  reconnect: (attemptNumber: number) => void;
  reconnect_attempt: (attemptNumber: number) => void;
  reconnect_error: (error: Error) => void;
  reconnect_failed: () => void;
};

// Meeting specific utility types
export type MeetingStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
export type UserRole = 'host' | 'participant' | 'admin';
export type MessageType = 'text' | 'file' | 'image' | 'system';

export type MeetingFilters = {
  status?: MeetingStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  participants?: string[];
  host?: string;
};

export type MeetingSort = {
  field: 'title' | 'startTime' | 'endTime' | 'status';
  direction: 'asc' | 'desc';
};

// Utility functions
export const isNonNullable = <T>(value: T): value is NonNullable<T> => {
  return value !== null && value !== undefined;
};

export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

export const isObject = (value: unknown): value is Record<string, any> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const isArray = (value: unknown): value is any[] => {
  return Array.isArray(value);
};

export const isFunction = (value: unknown): value is Function => {
  return typeof value === 'function';
};

// Type guards for specific types
export const isMeeting = (value: unknown): value is Meeting => {
  return (
    isObject(value) &&
    'id' in value &&
    'title' in value &&
    'startTime' in value &&
    'endTime' in value &&
    'status' in value
  );
};

export const isUser = (value: unknown): value is User => {
  return (
    isObject(value) &&
    'id' in value &&
    'name' in value &&
    'email' in value &&
    'role' in value
  );
};

export const isChatMessage = (value: unknown): value is ChatMessage => {
  return (
    isObject(value) &&
    'id' in value &&
    'content' in value &&
    'sender' in value &&
    'timestamp' in value &&
    'type' in value
  );
}; 