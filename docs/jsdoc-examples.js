/**
 * @fileoverview JSDoc configuration and examples for the portfolio project
 * 
 * This file demonstrates JSDoc best practices for documenting TypeScript code.
 * Use these patterns throughout the codebase for better IDE support and documentation.
 */

/**
 * Project-wide type definitions
 */

/**
 * User object type
 * @typedef {Object} User
 * @property {string} id - Unique identifier
 * @property {string} name - User's full name
 * @property {string} email - User's email address
 * @property {string} [avatar] - Optional avatar URL
 * @property {Date} createdAt - Account creation date
 */

/**
 * API Response type
 * @template T
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Indicates if request was successful
 * @property {T} [data] - Response data
 * @property {string} [error] - Error message if failed
 * @property {number} status - HTTP status code
 */

/**
 * Example function with complete documentation
 * 
 * @function fetchUserData
 * @async
 * @description Fetches user data from the API with error handling
 * @param {string} userId - The unique identifier of the user
 * @param {Object} [options] - Optional fetch options
 * @param {boolean} [options.includeAvatar=true] - Whether to include avatar URL
 * @param {number} [options.timeout=5000] - Request timeout in milliseconds
 * @returns {Promise<ApiResponse<User>>} Promise resolving to user data
 * @throws {Error} When userId is invalid or network request fails
 * 
 * @example
 * // Basic usage
 * const response = await fetchUserData('123');
 * if (response.success) {
 *   console.log(response.data.name);
 * }
 * 
 * @example
 * // With options
 * const response = await fetchUserData('123', {
 *   includeAvatar: false,
 *   timeout: 10000
 * });
 */
async function fetchUserData(userId, options = {}) {
  // Implementation...
}

/**
 * React Component Documentation
 * 
 * @component Button
 * @description A reusable button component with multiple variants
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {'primary' | 'secondary' | 'outline'} [props.variant='primary'] - Button style variant
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Button size
 * @param {boolean} [props.disabled=false] - Whether button is disabled
 * @param {boolean} [props.loading=false] - Whether button is in loading state
 * @param {() => void} [props.onClick] - Click handler
 * @param {string} [props.className] - Additional CSS classes
 * 
 * @returns {JSX.Element} Rendered button component
 * 
 * @example
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Click me
 * </Button>
 */

/**
 * Custom Hook Documentation
 * 
 * @hook useDebounce
 * @description Debounces a value with configurable delay
 * 
 * @template T
 * @param {T} value - The value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {T} Debounced value
 * 
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 500);
 * 
 * useEffect(() => {
 *   if (debouncedSearch) {
 *     fetchResults(debouncedSearch);
 *   }
 * }, [debouncedSearch]);
 */

/**
 * Class Documentation
 * 
 * @class ApiClient
 * @description HTTP client for API communication with authentication
 * 
 * @example
 * const api = new ApiClient('https://api.example.com');
 * await api.authenticate('token123');
 * const users = await api.get('/users');
 */
class ApiClient {
  /**
   * Creates an instance of ApiClient
   * @constructor
   * @param {string} baseUrl - Base URL for all requests
   * @param {Object} [config] - Optional configuration
   * @param {number} [config.timeout=30000] - Request timeout
   * @param {Record<string, string>} [config.headers] - Default headers
   */
  constructor(baseUrl, config = {}) {
    /**
     * Base URL for API requests
     * @type {string}
     * @private
     */
    this.baseUrl = baseUrl;
    
    /**
     * Authentication token
     * @type {string | null}
     * @private
     */
    this.token = null;
  }

  /**
   * Authenticates the client with a token
   * @public
   * @param {string} token - Authentication token
   * @returns {void}
   */
  authenticate(token) {
    this.token = token;
  }

  /**
   * Performs a GET request
   * @public
   * @async
   * @template T
   * @param {string} endpoint - API endpoint path
   * @param {Object} [params] - Query parameters
   * @returns {Promise<T>} Response data
   * @throws {Error} If request fails
   */
  async get(endpoint, params = {}) {
    // Implementation...
  }
}

/**
 * Utility function documentation
 * 
 * @function formatDate
 * @category Utilities
 * @description Formats a date according to locale and options
 * 
 * @param {Date | string | number} date - Date to format
 * @param {Object} [options] - Formatting options
 * @param {string} [options.locale='es'] - Locale for formatting
 * @param {Intl.DateTimeFormatOptions} [options.format] - Intl format options
 * @returns {string} Formatted date string
 * 
 * @example
 * formatDate(new Date()); // "15 de enero de 2024"
 * formatDate(new Date(), { locale: 'en' }); // "January 15, 2024"
 */

/**
 * Type Guard Documentation
 * 
 * @function isUser
 * @description Type guard to check if an object is a valid User
 * 
 * @param {unknown} value - Value to check
 * @returns {value is User} True if value is a User
 * 
 * @example
 * if (isUser(data)) {
 *   // TypeScript now knows data is User
 *   console.log(data.email);
 * }
 */

/**
 * Constant Documentation
 * 
 * @constant {number} MAX_FILE_SIZE
 * @description Maximum allowed file size for uploads (5MB)
 * @default 5242880
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Enum-like object documentation
 * 
 * @readonly
 * @enum {string}
 * @description User role types
 */
const UserRole = {
  /** Standard user with basic permissions */
  USER: 'user',
  /** Administrator with full permissions */
  ADMIN: 'admin',
  /** Moderator with limited admin permissions */
  MODERATOR: 'moderator',
};

/**
 * Complex type documentation
 * 
 * @typedef {Object} FilterOptions
 * @property {string} [search] - Search query string
 * @property {string[]} [tags] - Filter by tags
 * @property {Object} [date] - Date range filter
 * @property {Date} [date.from] - Start date
 * @property {Date} [date.to] - End date
 * @property {'asc' | 'desc'} [sort='desc'] - Sort direction
 * @property {number} [page=1] - Page number
 * @property {number} [perPage=10] - Items per page
 */

/**
 * Event handler documentation
 * 
 * @callback ClickHandler
 * @param {React.MouseEvent<HTMLButtonElement>} event - Click event
 * @returns {void | Promise<void>}
 * 
 * @example
 * const handleClick: ClickHandler = (event) => {
 *   event.preventDefault();
 *   console.log('Clicked!');
 * };
 */

/**
 * Module exports documentation
 * 
 * @module utils/helpers
 * @description Collection of utility helper functions
 * @since 1.0.0
 */

export {};
