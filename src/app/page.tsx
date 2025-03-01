import Terminal from '@/components/Terminal/Terminal';
import terminalData from '@/data/myspacegame.json';

export default function Home() {
  return (
    <main>
      <Terminal data={terminalData} />
    </main>
  );
}
