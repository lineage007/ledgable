"use client"

import { saveProfileAction } from "@/app/(app)/settings/actions"
import { FormError } from "@/components/forms/error"
import { FormAvatar } from "@/components/forms/simple"
import { Button } from "@/components/ui/button"
import { User } from "@/prisma/client"
import { CircleCheckBig, Building2, MapPin, Phone, CreditCard, FileText, Globe, Sparkles } from "lucide-react"
import { useActionState, useState } from "react"

// Parse structured JSON from the old freetext fields, or default to empty
function parseJson<T>(s: string | null | undefined, fallback: T): T {
  if (!s) return fallback
  try { return JSON.parse(s) } catch { return fallback }
}

type BusinessData = {
  legalName: string; tradingName: string; abn: string; acn: string;
  industry: string; entityType: string; gstRegistered: boolean; basFrequency: string;
  financialYearEnd: string;
  street: string; suburb: string; state: string; postcode: string; country: string;
  postalSameAsPhysical: boolean;
  postalStreet: string; postalSuburb: string; postalState: string; postalPostcode: string;
  phone: string; mobile: string; fax: string; website: string;
  email: string; invoiceEmail: string;
  bankName: string; bsb: string; accountNumber: string; accountName: string;
  paymentTerms: number; paymentTermsType: string;
  latePaymentFee: boolean; latePaymentRate: string;
  invoicePrefix: string; nextInvoiceNumber: string;
  quotePrefix: string; nextQuoteNumber: string;
  defaultNotes: string; defaultTerms: string;
}

const EMPTY: BusinessData = {
  legalName: '', tradingName: '', abn: '', acn: '',
  industry: '', entityType: 'Sole Trader', gstRegistered: true, basFrequency: 'Quarterly',
  financialYearEnd: '30 June',
  street: '', suburb: '', state: 'VIC', postcode: '', country: 'Australia',
  postalSameAsPhysical: true,
  postalStreet: '', postalSuburb: '', postalState: '', postalPostcode: '',
  phone: '', mobile: '', fax: '', website: '',
  email: '', invoiceEmail: '',
  bankName: '', bsb: '', accountNumber: '', accountName: '',
  paymentTerms: 30, paymentTermsType: 'After invoice date',
  latePaymentFee: false, latePaymentRate: '2',
  invoicePrefix: 'INV-', nextInvoiceNumber: '0001',
  quotePrefix: 'QT-', nextQuoteNumber: '0001',
  defaultNotes: '', defaultTerms: 'Payment due within 30 days of invoice date.',
}

const STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA']
const ENTITY_TYPES = ['Sole Trader', 'Partnership', 'Company', 'Trust', 'Not-for-profit', 'Other']
const BAS_FREQ = ['Monthly', 'Quarterly', 'Annually']
const FY_ENDS = ['30 June', '31 December', '31 March', '30 September']
const PAYMENT_TYPES = ['After invoice date', 'After end of invoice month', 'On a specific date']
const INDUSTRIES = [
  'Accommodation & Food', 'Agriculture', 'Arts & Recreation', 'Construction',
  'Education & Training', 'Financial Services', 'Healthcare', 'Information Technology',
  'Manufacturing', 'Mining', 'Professional Services', 'Property & Real Estate',
  'Retail', 'Transport', 'Wholesale', 'Other'
]

export default function BusinessSettingsForm({ user }: { user: User }) {
  const [saveState, saveAction, pending] = useActionState(saveProfileAction, null)

  // Parse existing data from the old fields
  const initial = {
    ...EMPTY,
    legalName: user.businessName || '',
    ...parseJson<Partial<BusinessData>>(user.businessAddress, {}),
    ...parseJson<Partial<BusinessData>>(user.businessBankDetails, {}),
  }
  const [data, setData] = useState<BusinessData>({ ...EMPTY, ...initial })
  const set = (field: keyof BusinessData, value: any) => setData(d => ({ ...d, [field]: value }))

  // ABN formatting: 51 824 753 556
  const formatABN = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return digits
    return digits.slice(0, 2) + ' ' + digits.slice(2).replace(/(\d{3})(?=\d)/g, '$1 ')
  }

  // BSB formatting: 063-019
  const formatBSB = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 6)
    if (digits.length <= 3) return digits
    return digits.slice(0, 3) + '-' + digits.slice(3)
  }

  return (
    <form action={(fd) => {
      // Serialize structured data into the existing fields
      fd.set('businessName', data.legalName || data.tradingName)
      fd.set('businessAddress', JSON.stringify({
        legalName: data.legalName, tradingName: data.tradingName,
        abn: data.abn, acn: data.acn, industry: data.industry, entityType: data.entityType,
        gstRegistered: data.gstRegistered, basFrequency: data.basFrequency, financialYearEnd: data.financialYearEnd,
        street: data.street, suburb: data.suburb, state: data.state, postcode: data.postcode, country: data.country,
        postalSameAsPhysical: data.postalSameAsPhysical,
        postalStreet: data.postalStreet, postalSuburb: data.postalSuburb, postalState: data.postalState, postalPostcode: data.postalPostcode,
        phone: data.phone, mobile: data.mobile, fax: data.fax, website: data.website,
        email: data.email, invoiceEmail: data.invoiceEmail,
      }))
      fd.set('businessBankDetails', JSON.stringify({
        bankName: data.bankName, bsb: data.bsb, accountNumber: data.accountNumber, accountName: data.accountName,
        paymentTerms: data.paymentTerms, paymentTermsType: data.paymentTermsType,
        latePaymentFee: data.latePaymentFee, latePaymentRate: data.latePaymentRate,
        invoicePrefix: data.invoicePrefix, nextInvoiceNumber: data.nextInvoiceNumber,
        quotePrefix: data.quotePrefix, nextQuoteNumber: data.nextQuoteNumber,
        defaultNotes: data.defaultNotes, defaultTerms: data.defaultTerms,
      }))
      saveAction(fd)
    }}
      className="w-full max-w-3xl space-y-8">

      {/* ═══ 1. Business Identity ═══ */}
      <Section icon={<Building2 className="w-4 h-4" />} title="Business Identity" desc="Legal name, ABN, and entity structure">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Legal / Entity Name *" value={data.legalName} onChange={v => set('legalName', v)} placeholder="Acme Pty Ltd" />
          <Input label="Trading Name" value={data.tradingName} onChange={v => set('tradingName', v)} placeholder="Acme" hint="If different from legal name" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="ABN" value={data.abn} onChange={v => set('abn', formatABN(v))} placeholder="51 824 753 556" hint="Australian Business Number" inputMode="numeric" />
          <Input label="ACN" value={data.acn} onChange={v => set('acn', v.replace(/\D/g, '').slice(0, 9))} placeholder="123 456 789" hint="Company number (if applicable)" inputMode="numeric" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select label="Entity Type" value={data.entityType} onChange={v => set('entityType', v)} options={ENTITY_TYPES} />
          <Select label="Industry" value={data.industry} onChange={v => set('industry', v)} options={INDUSTRIES} placeholder="Select industry..." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Toggle label="GST Registered" checked={data.gstRegistered} onChange={v => set('gstRegistered', v)} />
          <Select label="BAS Frequency" value={data.basFrequency} onChange={v => set('basFrequency', v)} options={BAS_FREQ} />
          <Select label="Financial Year End" value={data.financialYearEnd} onChange={v => set('financialYearEnd', v)} options={FY_ENDS} />
        </div>
      </Section>

      {/* ═══ 2. Address ═══ */}
      <Section icon={<MapPin className="w-4 h-4" />} title="Business Address" desc="Physical and postal address">
        <Input label="Street Address" value={data.street} onChange={v => set('street', v)} placeholder="42 Collins Street" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Input label="Suburb / City" value={data.suburb} onChange={v => set('suburb', v)} placeholder="Melbourne" className="col-span-2 md:col-span-1" />
          <Select label="State" value={data.state} onChange={v => set('state', v)} options={STATES} />
          <Input label="Postcode" value={data.postcode} onChange={v => set('postcode', v.replace(/\D/g, '').slice(0, 4))} placeholder="3000" inputMode="numeric" />
          <Input label="Country" value={data.country} onChange={v => set('country', v)} placeholder="Australia" className="hidden md:block" />
        </div>
        <Toggle label="Postal address same as physical" checked={data.postalSameAsPhysical} onChange={v => set('postalSameAsPhysical', v)} />
        {!data.postalSameAsPhysical && (
          <>
            <Input label="Postal Street" value={data.postalStreet} onChange={v => set('postalStreet', v)} placeholder="PO Box 123" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Input label="Postal Suburb" value={data.postalSuburb} onChange={v => set('postalSuburb', v)} />
              <Select label="Postal State" value={data.postalState} onChange={v => set('postalState', v)} options={STATES} />
              <Input label="Postal Postcode" value={data.postalPostcode} onChange={v => set('postalPostcode', v.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" />
            </div>
          </>
        )}
      </Section>

      {/* ═══ 3. Contact ═══ */}
      <Section icon={<Phone className="w-4 h-4" />} title="Contact Details" desc="Phone, email, and website">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Phone" value={data.phone} onChange={v => set('phone', v)} placeholder="03 9000 0000" inputMode="tel" />
          <Input label="Mobile" value={data.mobile} onChange={v => set('mobile', v)} placeholder="0400 000 000" inputMode="tel" />
          <Input label="Fax" value={data.fax} onChange={v => set('fax', v)} placeholder="03 9000 0001" inputMode="tel" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Business Email" value={data.email} onChange={v => set('email', v)} placeholder="hello@acme.com.au" type="email" />
          <Input label="Invoice Reply-To Email" value={data.invoiceEmail} onChange={v => set('invoiceEmail', v)} placeholder="accounts@acme.com.au" type="email" hint="Where clients reply to invoices" />
        </div>
        <Input label="Website" value={data.website} onChange={v => set('website', v)} placeholder="https://acme.com.au" icon={<Globe className="w-4 h-4" />} />
      </Section>

      {/* ═══ 4. Bank Details ═══ */}
      <Section icon={<CreditCard className="w-4 h-4" />} title="Bank Account" desc="Shown on invoices and used for bank reconciliation">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Bank Name" value={data.bankName} onChange={v => set('bankName', v)} placeholder="Commonwealth Bank" />
          <Input label="Account Name" value={data.accountName} onChange={v => set('accountName', v)} placeholder="Acme Pty Ltd" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="BSB" value={data.bsb} onChange={v => set('bsb', formatBSB(v))} placeholder="063-019" inputMode="numeric" />
          <Input label="Account Number" value={data.accountNumber} onChange={v => set('accountNumber', v.replace(/\D/g, ''))} placeholder="12345678" inputMode="numeric" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5 block">Payment Terms</label>
            <div className="flex items-center gap-2">
              <input value={data.paymentTerms} onChange={e => set('paymentTerms', parseInt(e.target.value) || 0)} type="number" min={0} max={365}
                className="w-20 px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-sm text-center font-mono focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none" />
              <span className="text-sm text-[#6B7280]">days</span>
              <select value={data.paymentTermsType} onChange={e => set('paymentTermsType', e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-sm focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none appearance-none">
                {PAYMENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <Toggle label="Charge late payment interest" checked={data.latePaymentFee} onChange={v => set('latePaymentFee', v)} />
            {data.latePaymentFee && (
              <div className="flex items-center gap-2 mt-2">
                <input value={data.latePaymentRate} onChange={e => set('latePaymentRate', e.target.value)}
                  className="w-16 px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-sm text-center font-mono focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none" />
                <span className="text-sm text-[#6B7280]">% per month on overdue</span>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* ═══ 5. Invoice Defaults ═══ */}
      <Section icon={<FileText className="w-4 h-4" />} title="Invoice & Quote Defaults" desc="Numbering, notes, and terms that pre-fill every invoice">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Input label="Invoice Prefix" value={data.invoicePrefix} onChange={v => set('invoicePrefix', v)} placeholder="INV-" />
          <Input label="Next Number" value={data.nextInvoiceNumber} onChange={v => set('nextInvoiceNumber', v)} placeholder="0001" />
          <Input label="Quote Prefix" value={data.quotePrefix} onChange={v => set('quotePrefix', v)} placeholder="QT-" />
          <Input label="Next Quote #" value={data.nextQuoteNumber} onChange={v => set('nextQuoteNumber', v)} placeholder="0001" />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5 block">Default Invoice Notes</label>
          <textarea value={data.defaultNotes} onChange={e => set('defaultNotes', e.target.value)} rows={2}
            placeholder="Thank you for your business. Please contact us if you have any questions."
            className="w-full px-3.5 py-3 rounded-xl border border-[#E5E7EB] bg-white text-sm focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none resize-none" />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5 block">Default Payment Terms Text</label>
          <textarea value={data.defaultTerms} onChange={e => set('defaultTerms', e.target.value)} rows={2}
            placeholder="Payment due within 30 days of invoice date. Late payments may incur a 2% monthly interest charge."
            className="w-full px-3.5 py-3 rounded-xl border border-[#E5E7EB] bg-white text-sm focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none resize-none" />
        </div>
      </Section>

      {/* ═══ 6. Logo ═══ */}
      <Section icon={<Building2 className="w-4 h-4" />} title="Business Logo" desc="Appears on invoices, quotes, and reports">
        <FormAvatar title="" name="businessLogo" className="w-40 h-40" defaultValue={user.businessLogo ?? ""} />
        <p className="text-xs text-[#9CA3AF]">Recommended: 400×400px, PNG or JPG. Max 2MB.</p>
      </Section>

      {/* ═══ Save ═══ */}
      <div className="flex items-center gap-4 pt-4 border-t border-[#E5E7EB]">
        <Button type="submit" disabled={pending} className="bg-[#0D9488] hover:bg-[#0F766E] text-white px-6 py-2.5">
          {pending ? "Saving..." : "Save Business Details"}
        </Button>
        {saveState?.success && (
          <p className="text-emerald-600 flex items-center gap-2 text-sm font-medium">
            <CircleCheckBig className="w-4 h-4" /> Saved!
          </p>
        )}
        {saveState?.error && <FormError>{saveState.error}</FormError>}
      </div>
    </form>
  )
}

// ══════════════════════════════════
// ── Sub-components ──
// ══════════════════════════════════

function Section({ icon, title, desc, children }: { icon: React.ReactNode; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div className="px-5 py-4 border-b border-[#F1F3F5] bg-[#FAFAFA]">
        <div className="flex items-center gap-2">
          <span className="text-[#6B7280]">{icon}</span>
          <h3 className="text-[15px] font-semibold text-[#1A1A2E]" style={{ letterSpacing: "-0.01em" }}>{title}</h3>
        </div>
        <p className="text-xs text-[#9CA3AF] mt-0.5 ml-6">{desc}</p>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

function Input({ label, value, onChange, placeholder, hint, type, inputMode, icon, className }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string;
  type?: string; inputMode?: "text" | "numeric" | "tel" | "email"; icon?: React.ReactNode; className?: string
}) {
  return (
    <div className={className}>
      <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5 block">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">{icon}</span>}
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type || "text"} inputMode={inputMode}
          className={`w-full py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-sm focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all ${icon ? 'pl-9 pr-3.5' : 'px-3.5'}`} />
      </div>
      {hint && <p className="text-[10px] text-[#9CA3AF] mt-1">{hint}</p>}
    </div>
  )
}

function Select({ label, value, onChange, options, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5 block">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-sm focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none appearance-none transition-all">
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer py-1">
      <button type="button" onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${checked ? 'bg-[#0D9488]' : 'bg-[#E5E7EB]'}`}>
        <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
      <span className="text-sm text-[#1A1A2E]">{label}</span>
    </label>
  )
}
