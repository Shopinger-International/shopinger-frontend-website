export {};

declare global {
  interface Window {
    RazorpayAffordabilitySuite: new (config: {
      key: string;
      amount: number;
    }) => {
      render: () => void;
    };
  }
}
