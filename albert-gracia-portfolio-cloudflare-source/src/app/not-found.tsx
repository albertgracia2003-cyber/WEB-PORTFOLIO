import { ArrowLink } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <section className="section surface-base not-found atmos">
      <div className="container">
        <p className="label">Error 404</p>
        <h1 className="display not-found__title">
          <span className="light">This page</span>
          <br />
          doesn&apos;t exist.
        </h1>
        <ArrowLink href="/">Back to the index</ArrowLink>
      </div>
    </section>
  );
}
