import type { Metadata } from 'next';
import DcaExperience from './DcaExperience';

export const metadata: Metadata = {
  title: 'Bitcoin DCA Education & Planner',
  description:
    'Learn about Bitcoin dollar-cost averaging, build a hypothetical plan, explore historical market data, and track purchases you record yourself.',
};

export default function DcaPage() {
  return <DcaExperience />;
}
