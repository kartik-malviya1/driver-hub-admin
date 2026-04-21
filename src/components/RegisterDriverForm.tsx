import { useRef, useState } from "react";
import { Upload, User, Car, IdCard, FileText, X, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Driver, VehicleType } from "@/data/drivers";
import { cn } from "@/lib/utils";

interface Props {
  onRegister: (driver: Driver) => void;
}

type DocKey = "photo" | "license" | "rc" | "id";

const docFields: { key: DocKey; label: string; hint: string; icon: typeof User }[] = [
  { key: "photo", label: "Driver Photo", hint: "Clear front-facing portrait", icon: User },
  { key: "license", label: "Driving License", hint: "Front side, all corners visible", icon: IdCard },
  { key: "rc", label: "RC Document", hint: "Vehicle registration certificate", icon: Car },
  { key: "id", label: "ID Proof", hint: "Aadhaar / Passport / Voter ID", icon: FileText },
];

const vehicleTypes: VehicleType[] = ["Electric", "Petrol", "CNG"];

export function RegisterDriverForm({ onRegister }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("Electric");
  const [files, setFiles] = useState<Partial<Record<DocKey, { url: string; name: string }>>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleFile = (key: DocKey, file: File | null) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", { description: "Max size is 5 MB per file." });
      return;
    }
    const url = URL.createObjectURL(file);
    setFiles((prev) => ({ ...prev, [key]: { url, name: file.name } }));
  };

  const removeFile = (key: DocKey) => {
    setFiles((prev) => {
      const next = { ...prev };
      if (next[key]) URL.revokeObjectURL(next[key]!.url);
      delete next[key];
      return next;
    });
  };

  const isValid =
    name.trim().length >= 2 &&
    phone.trim().length >= 8 &&
    vehicleNumber.trim().length >= 4 &&
    files.photo &&
    files.license &&
    files.rc &&
    files.id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      toast.error("Missing information", {
        description: "Please fill all fields and upload all 4 documents.",
      });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const id = `DRV-${Math.floor(1100 + Math.random() * 800)}`;
      const newDriver: Driver = {
        id,
        name: name.trim(),
        phone: phone.trim(),
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        vehicleType,
        registrationDate: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: "pending",
        photo: files.photo!.url,
        documents: {
          license: files.license!.url,
          rc: files.rc!.url,
          id: files.id!.url,
        },
      };
      onRegister(newDriver);
      toast.success("Driver registered", {
        description: `${newDriver.name} added to pending review queue.`,
      });
      setName("");
      setPhone("");
      setVehicleNumber("");
      setVehicleType("Electric");
      setFiles({});
      setSubmitting(false);
    }, 600);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden"
    >
      <div className="p-6 border-b border-border bg-gradient-to-r from-primary-soft/60 to-warning-soft/40">
        <h2 className="font-display font-bold text-xl tracking-tight">Register a New Driver</h2>
        <p className="text-sm text-muted-foreground mt-1">
          New driver applications go directly into the Pending review queue.
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal & vehicle */}
        <section className="space-y-5">
          <h3 className="font-display font-semibold text-sm text-foreground/80 uppercase tracking-wider">
            Driver Details
          </h3>

          <Field label="Full Name" required>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              placeholder="e.g. Rahul Mehta"
              className="input-base"
            />
          </Field>

          <Field label="Phone Number" required>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={20}
              placeholder="+91 98765 43210"
              className="input-base"
            />
          </Field>

          <Field label="Vehicle Number" required>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              maxLength={20}
              placeholder="DL 8C AT 7421"
              className="input-base font-mono uppercase"
            />
          </Field>

          <Field label="Vehicle Type" required>
            <div className="grid grid-cols-3 gap-2">
              {vehicleTypes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setVehicleType(t)}
                  className={cn(
                    "h-10 rounded-xl text-sm font-semibold border transition-all",
                    vehicleType === t
                      ? "bg-foreground text-background border-foreground shadow-soft"
                      : "bg-card border-border text-foreground/70 hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>
        </section>

        {/* Documents */}
        <section className="space-y-5">
          <h3 className="font-display font-semibold text-sm text-foreground/80 uppercase tracking-wider">
            Documents & Photo
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {docFields.map((f) => (
              <UploadTile
                key={f.key}
                docKey={f.key}
                label={f.label}
                hint={f.hint}
                icon={f.icon}
                file={files[f.key]}
                onSelect={handleFile}
                onRemove={removeFile}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="px-6 py-4 border-t border-border bg-muted/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          By submitting, you confirm all uploaded documents are authentic and verifiable.
        </p>
        <button
          type="submit"
          disabled={!isValid || submitting}
          className={cn(
            "h-11 px-6 rounded-xl text-sm font-semibold transition shadow-soft inline-flex items-center justify-center gap-2",
            isValid && !submitting
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted text-muted-foreground cursor-not-allowed",
          )}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Registering…
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} /> Submit for Review
            </>
          )}
        </button>
      </div>

      <style>{`
        .input-base {
          height: 2.625rem;
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          background: var(--card);
          padding: 0 0.875rem;
          font-size: 0.875rem;
          color: var(--foreground);
          transition: border-color .15s, box-shadow .15s;
        }
        .input-base::placeholder { color: var(--muted-foreground); }
        .input-base:focus {
          outline: none;
          border-color: color-mix(in oklab, var(--primary) 50%, transparent);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 25%, transparent);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-foreground/80 mb-1.5">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      {children}
    </label>
  );
}

function UploadTile({
  docKey,
  label,
  hint,
  icon: Icon,
  file,
  onSelect,
  onRemove,
}: {
  docKey: DocKey;
  label: string;
  hint: string;
  icon: typeof User;
  file?: { url: string; name: string };
  onSelect: (k: DocKey, f: File | null) => void;
  onRemove: (k: DocKey) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        onSelect(docKey, e.dataTransfer.files?.[0] ?? null);
      }}
      className={cn(
        "relative rounded-xl border border-dashed bg-card overflow-hidden transition-all",
        drag ? "border-primary bg-primary-soft/30" : "border-border hover:border-primary/40",
        file && "border-solid border-success/40 bg-success-soft/30",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onSelect(docKey, e.target.files?.[0] ?? null)}
      />

      {file ? (
        <div className="relative">
          <div className="aspect-[4/3] bg-muted overflow-hidden">
            <img src={file.url} alt={label} className="h-full w-full object-cover" />
          </div>
          <button
            type="button"
            onClick={() => onRemove(docKey)}
            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-foreground/80 text-background flex items-center justify-center hover:bg-foreground transition"
            aria-label="Remove file"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="p-2.5 flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-success-soft text-success flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">{label}</p>
              <p className="text-[10px] text-muted-foreground truncate">{file.name}</p>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full p-4 text-left flex flex-col items-start gap-2 min-h-[148px] justify-center"
        >
          <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">{label}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{hint}</p>
          </div>
          <div className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary">
            <Upload className="h-3 w-3" /> Upload or drag here
          </div>
        </button>
      )}
    </div>
  );
}
