interface SizeGuideProps {
  /** HTML or plain text from size_guide metafield */
  content?: string | null;
}

export function SizeGuide({ content }: SizeGuideProps) {
  if (!content?.trim()) return null;

  return (
    <details className="mt-6 group">
      <summary className="cursor-pointer text-sm font-medium text-neutral-600 hover:text-black list-none flex items-center gap-2">
        <span className="group-open:rotate-90 transition-transform">›</span>
        Size Guide
      </summary>
      <div
        className="mt-3 pl-4 prose prose-sm max-w-none text-neutral-600"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </details>
  );
}
