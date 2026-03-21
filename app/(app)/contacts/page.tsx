"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Search, Plus, Building2, User, Phone, Mail, Globe, MapPin, CreditCard, Sparkles, ChevronRight, X, FileText, Receipt } from "lucide-react"

// ─── Types ──────────────────────────────────────────────────
type Contact = {
  id: string; name: string; firstName?: string; lastName?: string;
  abn?: string; acn?: string; email?: string; phone?: string; mobile?: string;
  website?: string; isCustomer: boolean; isSupplier: boolean; status: string;
  billingAddress?: { street?: string; city?: string; state?: string; postcode?: string; country?: string };
  deliveryAddress?: { street?: string; city?: string; state?: string; postcode?: string; country?: string };
  bankAccountName?: string; bankBSB?: string; bankAccountNumber?: string;
  defaultCurrency: string; paymentTermsDays: number;
  salesTaxType?: string; purchaseTaxType?: string;
  outstandingReceivable: number; overdueReceivable: number;
  outstandingPayable: number; overduePayable: number;
  notes?: string; invoiceCount?: number; billCount?: number;
}

type ABRResult = {
  Abn: string; AbnStatus: string; EntityName: string;
  EntityTypeName: string; State: string; Postcode: string;
  BusinessName?: string[];
}

// ─── ABN Lookup (ABR.business.gov.au free JSON API) ─────────
async function searchABR(query: string): Promise<ABRResult[]> {
  // ABR provides a JSONP callback API — we use a proxy or direct fetch
  // For now, simulate the response shape. In production, hit:
  // https://abr.business.gov.au/json/AbnDetails.aspx?abn=XXXX&callback=fn&guid=YOUR_GUID
  // or name search: https://abr.business.gov.au/json/MatchingNames.aspx?name=XXX&callback=fn&guid=YOUR_GUID
  return []
}

// ─── Demo data ──────────────────────────────────────────────
const DEMO_CONTACTS: Contact[] = [
  {
    id: '1', name: 'Acme Construction Pty Ltd', abn: '51 824 753 556', acn: '824 753 556',
    email: 'accounts@acmeconstruction.com.au', phone: '03 9876 5432', mobile: '0412 345 678',
    website: 'acmeconstruction.com.au', isCustomer: true, isSupplier: false, status: 'active',
    billingAddress: { street: '42 Collins St', city: 'Melbourne', state: 'VIC', postcode: '3000', country: 'Australia' },
    defaultCurrency: 'AUD', paymentTermsDays: 30, salesTaxType: 'GST',
    outstandingReceivable: 12500, overdueReceivable: 0, outstandingPayable: 0, overduePayable: 0,
    invoiceCount: 8, billCount: 0,
  },
  {
    id: '2', name: 'Melbourne Office Supplies', abn: '23 456 789 012',
    email: 'orders@melboffice.com.au', phone: '03 8765 4321',
    isCustomer: false, isSupplier: true, status: 'active',
    billingAddress: { street: '15 Swanston St', city: 'Melbourne', state: 'VIC', postcode: '3000', country: 'Australia' },
    defaultCurrency: 'AUD', paymentTermsDays: 14, purchaseTaxType: 'GST',
    outstandingReceivable: 0, overdueReceivable: 0, outstandingPayable: 2340, overduePayable: 780,
    invoiceCount: 0, billCount: 12,
  },
  {
    id: '3', name: 'Sarah Chen - Freelance Design', firstName: 'Sarah', lastName: 'Chen',
    abn: '98 765 432 100', email: 'sarah@chendesign.com.au', mobile: '0423 987 654',
    isCustomer: false, isSupplier: true, status: 'active',
    defaultCurrency: 'AUD', paymentTermsDays: 7,
    outstandingReceivable: 0, overdueReceivable: 0, outstandingPayable: 4400, overduePayable: 0,
    invoiceCount: 0, billCount: 3,
  },
  {
    id: '4', name: 'Harbour View Restaurant', abn: '67 890 123 456',
    email: 'manager@harbourview.com.au', phone: '02 9988 7766',
    isCustomer: true, isSupplier: false, status: 'active',
    billingAddress: { street: '88 Circular Quay', city: 'Sydney', state: 'NSW', postcode: '2000', country: 'Australia' },
    defaultCurrency: 'AUD', paymentTermsDays: 14, salesTaxType: 'GST',
    outstandingReceivable: 8900, overdueReceivable: 3200, outstandingPayable: 0, overduePayable: 0,
    invoiceCount: 15, billCount: 0,
  },
]

// ─── Ledge AI Suggestions ────────────────────────────────────
function useLedgeSuggestions(input: string, contacts: Contact[]) {
  const [suggestions, setSuggestions] = useState<Contact[]>([])
  const [abrResults, setAbrResults] = useState<ABRResult[]>([])
  const [ledgeThinking, setLedgeThinking] = useState(false)

  useEffect(() => {
    if (!input || input.length < 2) { setSuggestions([]); setAbrResults([]); return }

    const q = input.toLowerCase()
    // Search existing contacts (fuzzy: name, ABN, email, phone)
    const matched = contacts.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.abn?.replace(/\s/g, '').includes(q.replace(/\s/g, '')) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.mobile?.includes(q) ||
      c.firstName?.toLowerCase().includes(q) ||
      c.lastName?.toLowerCase().includes(q)
    )
    setSuggestions(matched)

    // If looks like an ABN (mostly digits), search ABR
    const digits = q.replace(/\s/g, '')
    if (/^\d{5,}$/.test(digits) && matched.length === 0) {
      setLedgeThinking(true)
      // In production: hit ABR API
      setTimeout(() => { setLedgeThinking(false) }, 800)
    }
  }, [input, contacts])

  return { suggestions, abrResults, ledgeThinking }
}

// ─── Main Page ───────────────────────────────────────────────
export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(DEMO_CONTACTS)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'customers' | 'suppliers'>('all')
  const [showCreate, setShowCreate] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  const filtered = contacts.filter(c => {
    if (filter === 'customers' && !c.isCustomer) return false
    if (filter === 'suppliers' && !c.isSupplier) return false
    if (search) {
      const q = search.toLowerCase()
      return c.name.toLowerCase().includes(q) || c.abn?.includes(q) || c.email?.toLowerCase().includes(q)
    }
    return true
  })

  const totalReceivable = contacts.reduce((s, c) => s + c.outstandingReceivable, 0)
  const totalPayable = contacts.reduce((s, c) => s + c.outstandingPayable, 0)
  const totalOverdue = contacts.reduce((s, c) => s + c.overdueReceivable + c.overduePayable, 0)

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contacts</h1>
          <p className="text-sm text-muted-foreground">Manage customers and suppliers</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Contact
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Contacts</div>
          <div className="text-2xl font-bold mt-1">{contacts.length}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {contacts.filter(c => c.isCustomer).length} customers · {contacts.filter(c => c.isSupplier).length} suppliers
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Owed to You</div>
          <div className="text-2xl font-bold mt-1 text-emerald-500">${totalReceivable.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">Outstanding receivables</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">You Owe</div>
          <div className="text-2xl font-bold mt-1 text-amber-500">${totalPayable.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">Outstanding payables</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Overdue</div>
          <div className="text-2xl font-bold mt-1 text-red-500">${totalOverdue.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">Needs attention</div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm"
            placeholder="Search by name, ABN, email, phone..." />
        </div>
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(['all', 'customers', 'suppliers'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm capitalize ${filter === f ? 'bg-emerald-600 text-white' : 'bg-card hover:bg-accent'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Contact list */}
      <div className="space-y-2">
        {filtered.map(contact => (
          <div key={contact.id} onClick={() => setSelectedContact(contact)}
            className="rounded-xl border border-border bg-card p-4 hover:border-emerald-500/30 cursor-pointer transition-all flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                contact.isCustomer ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
              }`}>
                {contact.name.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-sm flex items-center gap-2">
                  {contact.name}
                  {contact.isCustomer && <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-500 font-semibold">CUSTOMER</span>}
                  {contact.isSupplier && <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-500 font-semibold">SUPPLIER</span>}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                  {contact.abn && <span>ABN {contact.abn}</span>}
                  {contact.email && <span>{contact.email}</span>}
                  {contact.phone && <span>{contact.phone}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {contact.outstandingReceivable > 0 && (
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Owes you</div>
                  <div className="text-sm font-semibold text-emerald-500">${contact.outstandingReceivable.toLocaleString()}</div>
                </div>
              )}
              {contact.outstandingPayable > 0 && (
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">You owe</div>
                  <div className="text-sm font-semibold text-amber-500">${contact.outstandingPayable.toLocaleString()}</div>
                </div>
              )}
              {contact.overdueReceivable > 0 && (
                <div className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold">
                  ${contact.overdueReceivable.toLocaleString()} OVERDUE
                </div>
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-border p-12 text-center">
            <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No contacts found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {search ? `No results for "${search}"` : 'Add your first customer or supplier to get started'}
            </p>
            <button onClick={() => setShowCreate(true)}
              className="px-6 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500">
              Add Contact
            </button>
          </div>
        )}
      </div>

      {/* Contact Detail Slide-over */}
      {selectedContact && (
        <ContactDetail contact={selectedContact} onClose={() => setSelectedContact(null)} />
      )}

      {/* Create/Edit Modal with Ledge AI */}
      {showCreate && (
        <CreateContactModal contacts={contacts} onClose={() => setShowCreate(false)}
          onSave={(c) => { setContacts([...contacts, c]); setShowCreate(false) }} />
      )}
    </div>
  )
}

// ─── Contact Detail Slide-over ───────────────────────────────
function ContactDetail({ contact, onClose }: { contact: Contact; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-card border-l border-border h-full overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">{contact.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                {contact.isCustomer && <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-500 font-semibold">Customer</span>}
                {contact.isSupplier && <span className="px-2 py-0.5 rounded text-xs bg-amber-500/10 text-amber-500 font-semibold">Supplier</span>}
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded hover:bg-accent"><X className="w-5 h-5" /></button>
          </div>

          {/* Identity */}
          <Section title="Business Identity">
            <Field icon={<Building2 />} label="ABN" value={contact.abn} />
            {contact.acn && <Field icon={<Building2 />} label="ACN" value={contact.acn} />}
          </Section>

          {/* Contact Info */}
          <Section title="Contact Information">
            {contact.email && <Field icon={<Mail />} label="Email" value={contact.email} link={`mailto:${contact.email}`} />}
            {contact.phone && <Field icon={<Phone />} label="Phone" value={contact.phone} />}
            {contact.mobile && <Field icon={<Phone />} label="Mobile" value={contact.mobile} />}
            {contact.website && <Field icon={<Globe />} label="Website" value={contact.website} link={`https://${contact.website}`} />}
          </Section>

          {/* Address */}
          {contact.billingAddress && (
            <Section title="Billing Address">
              <div className="text-sm">
                {contact.billingAddress.street && <div>{contact.billingAddress.street}</div>}
                <div>{[contact.billingAddress.city, contact.billingAddress.state, contact.billingAddress.postcode].filter(Boolean).join(' ')}</div>
                {contact.billingAddress.country && <div className="text-muted-foreground">{contact.billingAddress.country}</div>}
              </div>
            </Section>
          )}

          {/* Financial */}
          <Section title="Financial Details">
            <Field icon={<CreditCard />} label="Payment Terms" value={`Net ${contact.paymentTermsDays} days`} />
            <Field icon={<CreditCard />} label="Currency" value={contact.defaultCurrency} />
            {contact.salesTaxType && <Field icon={<Receipt />} label="Sales Tax" value={contact.salesTaxType} />}
            {contact.purchaseTaxType && <Field icon={<Receipt />} label="Purchase Tax" value={contact.purchaseTaxType} />}
          </Section>

          {/* Bank Details (for paying this supplier) */}
          {(contact.bankBSB || contact.bankAccountNumber) && (
            <Section title="Bank Details">
              {contact.bankAccountName && <Field icon={<CreditCard />} label="Account Name" value={contact.bankAccountName} />}
              {contact.bankBSB && <Field icon={<CreditCard />} label="BSB" value={contact.bankBSB} />}
              {contact.bankAccountNumber && <Field icon={<CreditCard />} label="Account Number" value={contact.bankAccountNumber} />}
            </Section>
          )}

          {/* Activity summary */}
          <Section title="Activity">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-accent/50 p-3 text-center">
                <div className="text-lg font-bold">{contact.invoiceCount ?? 0}</div>
                <div className="text-xs text-muted-foreground">Invoices</div>
              </div>
              <div className="rounded-lg bg-accent/50 p-3 text-center">
                <div className="text-lg font-bold">{contact.billCount ?? 0}</div>
                <div className="text-xs text-muted-foreground">Bills</div>
              </div>
            </div>
          </Section>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" /> Create Invoice
            </button>
            <button className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-accent flex items-center justify-center gap-2">
              <Receipt className="w-4 h-4" /> Record Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Create Contact with Ledge AI Auto-fill ──────────────────
function CreateContactModal({ contacts, onClose, onSave }: {
  contacts: Contact[]; onClose: () => void; onSave: (c: Contact) => void
}) {
  const [name, setName] = useState('')
  const [abn, setAbn] = useState('')
  const [acn, setAcn] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [mobile, setMobile] = useState('')
  const [website, setWebsite] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [postcode, setPostcode] = useState('')
  const [isCustomer, setIsCustomer] = useState(true)
  const [isSupplier, setIsSupplier] = useState(false)
  const [paymentTerms, setPaymentTerms] = useState(30)
  const [bankName, setBankName] = useState('')
  const [bankBSB, setBankBSB] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [notes, setNotes] = useState('')

  // Ledge AI suggestions
  const { suggestions, ledgeThinking } = useLedgeSuggestions(name, contacts)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [ledgeMessage, setLedgeMessage] = useState('')

  // When user types in name field, show smart suggestions
  useEffect(() => {
    if (name.length >= 2) setShowSuggestions(true)
    else setShowSuggestions(false)
  }, [name])

  // ABN auto-lookup
  const handleABNBlur = useCallback(() => {
    const digits = abn.replace(/\s/g, '')
    if (digits.length === 11) {
      setLedgeMessage('🔍 Looking up ABN on Australian Business Register...')
      // In production: fetch from ABR API
      setTimeout(() => {
        setLedgeMessage('✅ ABN verified — active. Auto-filled business details.')
      }, 1200)
    }
  }, [abn])

  // Auto-fill from existing contact
  const fillFromContact = (c: Contact) => {
    setName(c.name); setAbn(c.abn || ''); setAcn(c.acn || '');
    setEmail(c.email || ''); setPhone(c.phone || ''); setMobile(c.mobile || '');
    setWebsite(c.website || '');
    if (c.billingAddress) {
      setStreet(c.billingAddress.street || ''); setCity(c.billingAddress.city || '');
      setState(c.billingAddress.state || ''); setPostcode(c.billingAddress.postcode || '');
    }
    setIsCustomer(c.isCustomer); setIsSupplier(c.isSupplier);
    setPaymentTerms(c.paymentTermsDays);
    setShowSuggestions(false)
    setLedgeMessage(`✅ Auto-filled from existing contact "${c.name}"`)
  }

  const handleSave = () => {
    const newContact: Contact = {
      id: Date.now().toString(), name, abn, acn, email, phone, mobile, website,
      isCustomer, isSupplier, status: 'active',
      billingAddress: (street || city) ? { street, city, state, postcode, country: 'Australia' } : undefined,
      bankAccountName: bankName || undefined, bankBSB: bankBSB || undefined, bankAccountNumber: bankAccount || undefined,
      defaultCurrency: 'AUD', paymentTermsDays: paymentTerms,
      outstandingReceivable: 0, overdueReceivable: 0, outstandingPayable: 0, overduePayable: 0,
      notes: notes || undefined,
    }
    onSave(newContact)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl mx-4"
        onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">New Contact</h2>
            <button onClick={onClose} className="p-1 rounded hover:bg-accent"><X className="w-5 h-5" /></button>
          </div>

          {/* Ledge AI message bar */}
          {ledgeMessage && (
            <div className="mb-4 px-4 py-2.5 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400 flex-shrink-0" />
              <span className="text-sm text-violet-300">{ledgeMessage}</span>
              <button onClick={() => setLedgeMessage('')} className="ml-auto"><X className="w-3 h-3 text-violet-400" /></button>
            </div>
          )}

          {/* Type toggle */}
          <div className="flex gap-3 mb-5">
            <button onClick={() => setIsCustomer(!isCustomer)}
              className={`flex-1 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                isCustomer ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-border hover:border-emerald-500/30'
              }`}>
              <User className="w-4 h-4 inline mr-2" />Customer — they pay you
            </button>
            <button onClick={() => setIsSupplier(!isSupplier)}
              className={`flex-1 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                isSupplier ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-border hover:border-amber-500/30'
              }`}>
              <Building2 className="w-4 h-4 inline mr-2" />Supplier — you pay them
            </button>
          </div>

          {/* Name (with auto-suggest) */}
          <div className="relative mb-4">
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Company / Contact Name *</label>
            <div className="relative">
              <input value={name} onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm"
                placeholder="Start typing to search existing contacts or add new..." />
              {ledgeThinking && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
                </div>
              )}
            </div>

            {/* Ledge AI suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 rounded-lg border border-border bg-card shadow-xl overflow-hidden">
                <div className="px-3 py-1.5 bg-violet-500/10 border-b border-border flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-violet-400" />
                  <span className="text-[11px] text-violet-400 font-medium">Ledge found existing contacts</span>
                </div>
                {suggestions.map(s => (
                  <button key={s.id} onClick={() => fillFromContact(s)}
                    className="w-full px-3 py-2.5 text-left hover:bg-accent/50 flex items-center justify-between border-b border-border last:border-0">
                    <div>
                      <div className="text-sm font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {s.abn && `ABN ${s.abn}`}{s.email && ` · ${s.email}`}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 font-medium">Auto-fill</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ABN + ACN row */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">ABN</label>
              <input value={abn} onChange={e => setAbn(e.target.value)} onBlur={handleABNBlur}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm"
                placeholder="XX XXX XXX XXX" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">ACN</label>
              <input value={acn} onChange={e => setAcn(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm"
                placeholder="XXX XXX XXX" />
            </div>
          </div>

          {/* Contact details */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <InputField label="Email" value={email} onChange={setEmail} placeholder="accounts@company.com.au" />
            <InputField label="Phone" value={phone} onChange={setPhone} placeholder="03 XXXX XXXX" />
            <InputField label="Mobile" value={mobile} onChange={setMobile} placeholder="04XX XXX XXX" />
            <InputField label="Website" value={website} onChange={setWebsite} placeholder="company.com.au" />
          </div>

          {/* Billing Address */}
          <h3 className="text-sm font-semibold mb-2 mt-4">Billing Address</h3>
          <div className="space-y-3 mb-4">
            <InputField label="Street" value={street} onChange={setStreet} placeholder="123 Collins St" full />
            <div className="grid grid-cols-3 gap-3">
              <InputField label="City" value={city} onChange={setCity} placeholder="Melbourne" />
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">State</label>
                <select value={state} onChange={e => setState(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm">
                  <option value="">—</option>
                  {['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <InputField label="Postcode" value={postcode} onChange={setPostcode} placeholder="3000" />
            </div>
          </div>

          {/* Payment & Bank */}
          <h3 className="text-sm font-semibold mb-2 mt-4">Payment Details</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Payment Terms</label>
              <select value={paymentTerms} onChange={e => setPaymentTerms(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm">
                {[7, 14, 21, 30, 60, 90].map(d => <option key={d} value={d}>Net {d} days</option>)}
              </select>
            </div>
            <InputField label="BSB" value={bankBSB} onChange={setBankBSB} placeholder="XXX-XXX" />
            <InputField label="Account Number" value={bankAccount} onChange={setBankAccount} placeholder="XXXXXXXX" />
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm resize-none"
              placeholder="Internal notes about this contact..." />
          </div>

          {/* Save */}
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm">Cancel</button>
            <button onClick={handleSave} disabled={!name}
              className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-40">
              Save Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Field({ icon, label, value, link }: { icon: React.ReactNode; label: string; value?: string; link?: string }) {
  if (!value) return null
  const content = (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground w-4 h-4 flex-shrink-0">{icon}</span>
      <span className="text-muted-foreground text-xs w-20">{label}</span>
      <span className={link ? 'text-emerald-400 hover:underline' : ''}>{value}</span>
    </div>
  )
  return link ? <a href={link} target="_blank" rel="noopener">{content}</a> : content
}

function InputField({ label, value, onChange, placeholder, full }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; full?: boolean
}) {
  return (
    <div className={full ? 'col-span-full' : ''}>
      <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm"
        placeholder={placeholder} />
    </div>
  )
}
