import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function BlogTemplatePreviewDialog({ open, onOpenChange, template }) {
  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-secondary text-white border-white/10 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">{template.name_en}</DialogTitle>
        </DialogHeader>
        <div className="bg-white text-foreground rounded-lg p-6">
          <article
            className="blog-content prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: template.content_structure_en || "<p>No content structure defined.</p>" }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}