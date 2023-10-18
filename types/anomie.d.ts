declare global {
  type AnomieConfig = {
    app: {
      name: string;
      version: string;
      description: string;
      website: string;
    };
    settings: {};
    ui: {
      loadingIndicator: {
        color: string;
        background: string;
        height: number;
      };
    };
  };
}

export {};
