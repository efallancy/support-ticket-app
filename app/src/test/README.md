# Testing Documentation for Support Ticket App

This document provides instructions and guidelines for testing the Support Ticket App.

## Test Setup

The app uses Vitest and Testing Library for unit and component testing.

### Test Files Structure

- `src/test/setup.ts` - Basic test setup and global mocks
- `src/test/test-config.ts` - Comprehensive mock functions and test data
- `src/test/utils.tsx` - Utility functions for testing, including router setup

### Test Files Organization

Tests are located alongside their corresponding components with a `.test.tsx` suffix.

## Running Tests

You can run the tests using the following npm scripts:

```bash
# Run all tests once
npm test

# Run tests in watch mode during development
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Writing Tests

### Component Tests

When testing components, use the following pattern:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { YourComponent } from './your-component';
import { setupMocks, sampleTickets } from '../test/test-config';

// Setup mocks for testing
setupMocks();

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const user = userEvent.setup();
    render(<YourComponent />);
    
    await user.click(screen.getByRole('button', { name: /button name/i }));
    
    // Assertions...
  });
});
```

### Testing Components with Router

When testing components that use router functionality:

```tsx
import { renderWithRouter } from '../test/utils';

describe('ComponentWithRouter', () => {
  it('navigates correctly', async () => {
    const { user } = renderWithRouter(<ComponentWithRouter />);
    
    // Test navigation...
  });
});
```

### Mocking API Calls

The `test-config.ts` file provides mock functions for all API calls:

```tsx
import { 
  mockFetchSupportTickets, 
  mockCreateSupportTicket 
} from '../test/test-config';

// Set up the mock response
mockFetchSupportTickets.mockResolvedValue([/* your test data */]);

// Verify the mock was called
expect(mockFetchSupportTickets).toHaveBeenCalledTimes(1);
```

## Testing Guidelines

1. **Component Testing**: Test rendering, user interactions, and error states
2. **Form Testing**: Test validation, submission, and error handling
3. **API Testing**: Mock API calls and test success/error handling
4. **Accessibility Testing**: Ensure components are accessible by using proper ARIA roles

## Common Testing Patterns

### Testing Form Submission

```tsx
it('submits the form with valid data', async () => {
  const user = userEvent.setup();
  const handleSubmit = vi.fn();
  
  render(<YourForm onSubmit={handleSubmit} />);
  
  // Fill out form fields
  await user.type(screen.getByLabelText(/name/i), 'Test Name');
  
  // Submit form
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  // Verify submission
  expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
    name: 'Test Name'
  }));
});
```

### Testing API Error Handling

```tsx
it('displays error message when API call fails', async () => {
  mockFetchSupportTickets.mockRejectedValueOnce(new Error('Network error'));
  
  render(<YourComponent />);
  
  await waitFor(() => {
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });
});
```

## Troubleshooting Common Issues

1. **Test Fails to Find Elements**: 
   - Try using more flexible queries like `getByRole` or `getByText(/pattern/i)`
   - Check that the component renders as expected
   - Use the debug() function to see the rendered DOM: `screen.debug()`

2. **Mock Functions Not Working**:
   - Ensure you're importing from `test-config.ts` and not mocking directly
   - Verify mock implementation with console.log

3. **Router Testing Issues**:
   - Use `renderWithRouter` from utils.tsx instead of regular render
   - Verify the route parameters are correctly set up

Happy testing!