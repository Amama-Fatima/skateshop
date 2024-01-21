// inlined `React.JSXElementConstructor`
type ReactJSXElementConstructor<Props> =
  | ((props: Props) => React.ReactNode)
  | (new (props: Props) => React.Component<Props, unknown>);

declare global {
  namespace JSX {
    type ElementType = string | ReactJSXElementConstructor<unknown>;
  }
}


// In summary, this TypeScript declaration file enhances the global JSX namespace by introducing a custom ReactJSXElementConstructor type and extending the JSX namespace with a new ElementType type. This type provides a way to express the possible types that can be used as JSX elements within the project, including both string literals (for HTML tags) and custom React component types. This can be useful for ensuring type safety and providing better TypeScript support in a React project.