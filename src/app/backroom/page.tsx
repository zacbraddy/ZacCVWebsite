import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Backroom',
};

export default function BackroomOverview() {
  return (
    <div>
      <h1 className="font-fancy-heading text-4xl text-secondary sm:text-6xl mb-4">
        The Backroom
      </h1>
      <p className="text-tertiary sm:text-2xl">
        Behind the front of house. More to come.
      </p>
    </div>
  );
}
