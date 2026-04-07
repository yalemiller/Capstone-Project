import appContentJson from '../../data/appContent.json';

type SceneContent = {
  scenes: {
    scene1: {
      swipePrompt: string;
    };
    scene2: {
      headline: [string, string] | string[];
      body: string;
    };
    scene3: {
      helperText: string;
      completionText: {
        line1: string;
        line2: string;
      };
    };
    scene4: {
      emptyStateText: string;
      riskLevelLabels: Record<string, string>;
      categoryLabels: Record<string, string>;
      fallbackFood: {
        categories: string[];
        riskLevel: string;
        vulnerabilityScore: number;
        primaryThreat: string;
        cost: {
          currentAvg: number;
          predictedAvg: number;
          currency: string;
          unit: string;
        };
      };
      priceChart: {
        maxScaleFloor: number;
        minimumBaseline: number;
        currentLabel: string;
        projectedLabel: string;
      };
    };
    scene5: {
      headline: string;
      totalPrice: string;
    };
    scene6: {
      headline: string;
      totalPrice: string;
      increaseText: string;
    };
    scene7: {
      title: string;
      subtitle: string;
    };
    scene8: {
      title: string;
      subtitle: string;
    };
  };
};

export const appContent = appContentJson as SceneContent;
