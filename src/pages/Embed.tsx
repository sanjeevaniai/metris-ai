import { DemoFlow } from '@/components/demo/DemoFlow';
import { ScoutChat } from '@/components/scout/ScoutChat';

// Embeddable version without header/layout for iframe integration
const Embed = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <DemoFlow />
      <ScoutChat />
    </div>
  );
};

export default Embed;
