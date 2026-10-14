import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[55vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="font-mono text-sm font-bold uppercase tracking-widest text-primary">404 · Page not found</p>
      <h1 className="mt-3 font-syne text-3xl font-extrabold text-on-surface sm:text-4xl">We couldn’t find that page.</h1>
      <p className="mt-3 max-w-xl text-on-surface-variant">The address may be incorrect, or the page may have moved.</p>
      <Link className="mt-7 rounded-xl bg-primary px-5 py-3 font-bold text-white hover:bg-primary-container" to="/">Return home</Link>
    </section>
  );
}
