# Error Boundary System

This directory contains a comprehensive error handling system for the Workfolio application.

## Components

### 1. ErrorBoundary
A generic error boundary component that can be used to wrap any part of the component tree.

**Usage:**
```tsx
import { ErrorBoundary } from '../common';

<ErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</ErrorBoundary>
```

**Features:**
- Catches JavaScript errors in child components
- Provides a default user-friendly error UI
- Supports custom fallback components
- Shows detailed error information in development mode
- Logs errors to console for debugging

### 2. AppErrorBoundary
A specialized error boundary for catching critical application errors.

**Usage:**
```tsx
import { AppErrorBoundary } from '../common';

<AppErrorBoundary>
  <YourApp />
</AppErrorBoundary>
```

**Features:**
- Enhanced error UI with more detailed information
- Better styling for critical errors
- Comprehensive error logging
- Development-mode technical details

### 3. ErrorTestComponent
A utility component for testing error boundaries during development.

**Usage:**
```tsx
import { ErrorTestComponent } from '../common';

// Normal operation
<ErrorTestComponent />

// Test error boundary
<ErrorTestComponent shouldThrow={true} />
```

## Current Implementation

The error boundary system is currently integrated into the application at the Layout level:

```tsx
// In Layout.tsx
<ErrorBoundary>
  <Suspense fallback={<PageLoader />}>
    <motion.div>
      <Outlet />
    </motion.div>
  </Suspense>
</ErrorBoundary>
```

This setup provides:
- **Error Protection**: Catches errors in any page component
- **Loading States**: Handles lazy-loading with Suspense
- **Smooth Transitions**: Maintains Framer Motion animations
- **Graceful Degradation**: Shows error UI instead of crashing

## Best Practices

1. **Strategic Placement**: Place error boundaries at logical boundaries in your component tree
2. **Custom Fallbacks**: Use custom fallback components for specific error scenarios
3. **Error Logging**: In production, integrate with error reporting services
4. **User Experience**: Provide clear actions for users to recover from errors
5. **Development Details**: Show technical details only in development mode

## Future Enhancements

- Integration with error reporting services (Sentry, LogRocket, etc.)
- Error recovery mechanisms
- Error analytics and monitoring
- Custom error types and handling
- Error boundary testing utilities 