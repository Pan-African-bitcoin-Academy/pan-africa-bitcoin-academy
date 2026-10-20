'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/hooks/useAuth';
import { AnimatedSection } from '@/components/AnimatedSection';
import { AnimatedHeading } from '@/components/AnimatedHeading';
import SplitText from '@/components/SplitText';
import { DatePicker } from '@/components/ui/DatePicker';
import { sortedCountries, getPhoneRule } from '@/lib/countries';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { inputStyles, labelStyles, cn } from '@/lib/styles';
import { FormGrid } from '@/components/ui';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useLanguage } from '@/contexts/LanguageContext';
import { getApplyCopy } from '@/lib/translations/apply';

interface Cohort {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  sessions: number;
  level: string;
  seats: number;
  available: number;
  enrolled: number;
}

type LearningPace = 'live_cohort' | 'self_paced';

const applySocialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61586743276906' },
  { label: 'X (Twitter)', href: 'https://x.com/panafricanbtc' },
  { label: 'Instagram', href: 'https://www.instagram.com/panafricanbitcoin/' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@panafricanbitcoin' },
  { label: 'Discord', href: 'https://discord.gg/4G4TUAP7' },
  { label: 'GitHub', href: 'https://github.com/Joie199/pan-africa-bitcoin-academy' },
] as const;

const whatsappGroupLink = 'https://chat.whatsapp.com/KpjlC90BGIj1EChMHsW6Ji';

export default function ApplyPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = getApplyCopy(language);

  const { isAuthenticated, profile, isRegistered, loading: authLoading } = useAuth();
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [cohortsLoading, setCohortsLoading] = useState(true);
  const [cohortsError, setCohortsError] = useState<string | null>(null);
  const [selectedCohort, setSelectedCohort] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Show loading spinner overlay when submitting
  useEffect(() => {
    if (submitting) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [submitting]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (codeDropdownRef.current && !codeDropdownRef.current.contains(e.target as Node)) {
        setCodeDropdownOpen(false);
        setCodeSearch("");
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Redirect enrolled students away from the apply flow
  useEffect(() => {
    if (!authLoading && isAuthenticated && isRegistered) {
      router.replace('/dashboard');
    }
  }, [authLoading, isAuthenticated, isRegistered, router]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneValid, setPhoneValid] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [codeDropdownOpen, setCodeDropdownOpen] = useState(false);
  const [codeSearch, setCodeSearch] = useState("");
  const codeDropdownRef = useRef<HTMLDivElement>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    experienceLevel: "",
    preferredCohort: "",
    birthDate: "",
    preferredLanguage: "",
    learningPace: 'live_cohort' as LearningPace,
  });

  // Pre-fill form data from profile if user is logged in
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !profile) return;
    
    const isFormEmpty = !formData.firstName && !formData.lastName && !formData.email;
    if (!isFormEmpty) return;
    
    const nameParts = profile.name?.split(' ') || [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    let countryToSet = profile.country || '';
    let countryCodeToSet = '';
    let phoneNumberToSet = '';
    
    if (profile.phone) {
      const phoneParts = profile.phone.split(' ');
      if (phoneParts.length >= 2) {
        const code = phoneParts[0];
        const number = phoneParts.slice(1).join(' ');
        countryCodeToSet = code;
        phoneNumberToSet = number;
        const country = sortedCountries.find(c => c.code === code);
        if (country) {
          countryToSet = country.name;
        }
      } else {
        phoneNumberToSet = profile.phone;
      }
    }

    if (countryCodeToSet) setSelectedCountryCode(countryCodeToSet);
    if (phoneNumberToSet) setPhoneNumber(phoneNumberToSet);
    if (countryToSet) setSelectedCountry(countryToSet);

    setFormData({
      firstName: firstName,
      lastName: lastName,
      email: profile.email || '',
      phone: profile.phone || '',
      country: countryToSet,
      city: profile.city || '',
      experienceLevel: '',
      preferredCohort: '',
      birthDate: '',
      preferredLanguage: '',
      learningPace: 'live_cohort',
    });
  }, [authLoading, isAuthenticated, profile]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setPhoneError(null);
    const countryData = sortedCountries.find((c) => c.name === country);
    if (countryData) {
      setSelectedCountryCode(countryData.code);
    }
    setFormData({ ...formData, country });
  };

  const validateWhatsAppNumber = (code: string, number: string, strict = false) => {
    const digits = number.replace(/\D/g, '');
    if (!code || digits.length === 0) {
      setPhoneError(null);
      setPhoneValid(false);
      return;
    }
    const cleanCode = code.replace(/[^+\d]/g, '');
    const fullNumber = `${cleanCode}${digits}`;
    try {
      if (isValidPhoneNumber(fullNumber)) {
        const parsed = parsePhoneNumber(fullNumber);
        if (parsed) {
          setPhoneError(null);
          setPhoneValid(true);
          setFormData(prev => ({ ...prev, phone: parsed.formatInternational() }));
          return;
        }
      }
      setPhoneValid(false);
      const { max } = getPhoneRule(selectedCountry);
      if (digits.length > max) {
        setPhoneError(`Number too long — max ${max} digits for ${selectedCountry || 'this country'}.`);
      } else if (strict) {
        setPhoneError(`Invalid WhatsApp number for ${selectedCountry || 'this country'}. Please check and try again.`);
      } else {
        setPhoneError(null);
      }
    } catch {
      setPhoneError(null);
      setPhoneValid(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^\d\s]/g, "");
    setPhoneNumber(cleanedValue);

    const fullPhone = selectedCountryCode && cleanedValue ? `${selectedCountryCode} ${cleanedValue}`.trim() : cleanedValue;
    setFormData({ ...formData, phone: fullPhone });

    validateWhatsAppNumber(selectedCountryCode, cleanedValue, false);
  };

  const handlePhoneBlur = () => {
    if (phoneNumber.replace(/\D/g, '').length > 0 && selectedCountryCode) {
      validateWhatsAppNumber(selectedCountryCode, phoneNumber, true);
    }
  };

  const fetchCohorts = useCallback(async (retryAfter429 = true) => {
    try {
      setCohortsLoading(true);
      setCohortsError(null);
      const res = await fetch('/api/cohorts', { cache: 'no-store' });
      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        const retryAfter = data.retryAfter ?? 60;
        setCohortsError(`Too many requests. Retrying in ${retryAfter} seconds…`);
        if (retryAfter429) {
          setTimeout(() => fetchCohorts(false), retryAfter * 1000);
          return;
        }
        throw new Error('Too many requests. Please wait a moment and refresh the page.');
      }
      if (!res.ok) {
        throw new Error(`Failed to fetch cohorts: ${res.status}`);
      }
      const data = await res.json();

      const formatDate = (dateStr: string) => {
        if (!dateStr) return 'TBD';
        try {
          const date = new Date(dateStr);
          return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          });
        } catch {
          return dateStr;
        }
      };

      const formattedCohorts: Cohort[] = (data.cohorts || []).map((cohort: any) => ({
        id: cohort.id,
        name: cohort.name || 'Unnamed Cohort',
        startDate: formatDate(cohort.startDate),
        endDate: formatDate(cohort.endDate),
        status: cohort.status || '',
        sessions: cohort.sessions || 0,
        level: cohort.level || 'Beginner',
        seats: cohort.seats || 0,
        available: cohort.available || 0,
        enrolled: cohort.enrolled || 0,
      }));

      setCohorts(formattedCohorts);
    } catch (err: any) {
      console.error('Error fetching cohorts:', err);
      setCohortsError(err.message || 'Failed to load cohorts');
      setCohorts([]);
    } finally {
      setCohortsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCohorts();
  }, [fetchCohorts]);

  useEffect(() => {
    const onFocus = () => fetchCohorts();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchCohorts]);

  const normalizeLevel = (level: string | undefined): string => {
    if (!level) return '';
    const normalized = level.trim().toLowerCase();
    if (normalized === 'beginner') return 'beginner';
    if (normalized === 'intermediate') return 'intermediate';
    if (normalized === 'advanced') return 'advanced';
    return normalized;
  };

  useEffect(() => {
    if (formData.learningPace === 'self_paced') {
      return;
    }
    if (selectedCohort !== null) {
      const cohort = cohorts.find((c) => c.id === selectedCohort);
      if (cohort) {
        const normalizedLevel = normalizeLevel(cohort.level);
        setFormData((prev) => ({
          ...prev,
          preferredCohort: cohort.id,
          experienceLevel: normalizedLevel,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        experienceLevel: '',
      }));
    }
  }, [selectedCohort, cohorts, formData.learningPace]);

  const handleLearningPaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value as LearningPace;
    setFormData((prev) => ({
      ...prev,
      learningPace: v,
      preferredCohort: v === 'self_paced' ? '' : prev.preferredCohort,
    }));
    if (v === 'self_paced') {
      setSelectedCohort(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    setSubmitting(true);
    setPhoneError(null);

    if (!selectedCountry) {
      setSubmitError(t.form.messages.validation_country);
      setPhoneError(t.form.messages.validation_country);
      setSubmitting(false);
      return;
    }
    if (!selectedCountryCode) {
      setSubmitError(t.form.messages.validation_country_code);
      setPhoneError(t.form.messages.validation_country_code);
      setSubmitting(false);
      return;
    }

    const phoneDigits = phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length === 0) {
      setSubmitError(t.form.messages.validation_phone);
      setPhoneError(t.form.messages.validation_phone);
      setSubmitting(false);
      return;
    }

    const cleanCode = selectedCountryCode.replace(/[^+\d]/g, '');
    const fullNumber = `${cleanCode}${phoneDigits}`;
    if (!isValidPhoneNumber(fullNumber)) {
      const msg = `Invalid WhatsApp number for ${selectedCountry}. Please check the number and try again.`;
      setSubmitError(msg);
      setPhoneError(msg);
      setSubmitting(false);
      return;
    }
    
    const selectedCohortObj =
      formData.learningPace === 'live_cohort' && selectedCohort
        ? cohorts.find((c) => c.id === selectedCohort)
        : null;

    if (formData.learningPace === 'live_cohort') {
      if (!selectedCohortObj) {
        setSubmitError(t.form.messages.validation_cohort_required);
        setSubmitting(false);
        return;
      }
      if (selectedCohortObj.available === 0) {
        setSubmitError(t.form.messages.validation_cohort_full);
        setSubmitting(false);
        return;
      }
    }

    const cohortNumber =
      formData.learningPace === 'live_cohort' && selectedCohortObj
        ? selectedCohortObj.id
        : null;

    const finalFormData = {
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      country: selectedCountry,
      birthDate: birthDate || null,
      phone: (() => {
        try {
          const parsed = parsePhoneNumber(`${cleanCode}${phoneDigits}`);
          return parsed ? parsed.formatInternational() : `${selectedCountryCode} ${phoneNumber}`.trim();
        } catch { return `${selectedCountryCode} ${phoneNumber}`.trim(); }
      })(),
      preferredCohort: cohortNumber,
      preferredLanguage: formData.preferredLanguage || null,
      learningPace: formData.learningPace,
    };

    try {
      const applicationRes = await fetch('/api/submit-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalFormData),
      });

      const result = await applicationRes.json();

      if (applicationRes.ok) {
        if (result.verificationEmailSent) {
          setSubmitSuccess(t.form.messages.success_verification_email);
        } else {
          setSubmitSuccess(t.form.messages.success_default);
        }
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          country: "",
          city: "",
          experienceLevel: "",
          preferredCohort: "",
          birthDate: "",
          preferredLanguage: "",
          learningPace: 'live_cohort',
        });
        setSelectedCountry("");
        setSelectedCountryCode("");
        setPhoneNumber("");
        setSelectedCohort(null);
        setBirthDate("");
      } else {
        if (result.hasProfile && result.needsSignIn) {
          setSubmitError(t.form.messages.error_existing_account);
        } else if (result.hasProfile && result.needsPassword) {
          setSubmitError(t.form.messages.error_already_approved);
        } else {
          const errorMsg = result.error || t.form.messages.error_default;
          const errorDetails = result.details ? ` (${result.details})` : '';
          throw new Error(errorMsg + errorDetails);
        }
      }
    } catch (error: any) {
      console.error('Error submitting application:', error);
      setSubmitError(error.message || t.form.messages.error_default);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {submitting && <LoadingSpinner overlay />}
      <div className="relative z-10 w-full bg-black/95">
        <div className="w-full px-4 py-12 sm:px-6 sm:py-16 sm:max-w-7xl sm:mx-auto lg:px-8 lg:py-20">
          {/* Hero Section */}
          <AnimatedSection animation="slideUp">
            <div className="mb-16 text-center w-full">
              <AnimatedHeading as="h1" className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
                <SplitText
                  text={t.hero.title}
                  tag="span"
                  className="inline-block"
                  delay={50}
                  duration={1.25}
                  ease="bounce.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                />
              </AnimatedHeading>
              <p className="w-full mt-6 text-lg text-zinc-400 sm:text-xl sm:max-w-3xl sm:mx-auto">
                {t.hero.subtitle_prefix}
                <b>{t.hero.subtitle_bold}</b>
                {t.hero.subtitle_suffix}
              </p>
            </div>
          </AnimatedSection>

          <div className="space-y-12">
            {/* Registration Form */}
            <AnimatedSection animation="slideRight">
              <section className="rounded-2xl border border-cyan-400/30 bg-gradient-to-b from-zinc-900/90 to-black/90 p-6 sm:p-8 shadow-[0_0_40px_rgba(34,211,238,0.15)] ring-1 ring-cyan-400/10">
                <AnimatedHeading as="h2" className="mb-2 text-xl font-semibold text-cyan-200">
                  {t.form.heading}
                </AnimatedHeading>
                <div className="mb-6 space-y-2 text-sm">
                  <p className="text-zinc-400">
                    {t.form.intro}
                  </p>
                </div>
                {submitSuccess && (
                  <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-200">
                    {submitSuccess}
                  </div>
                )}
                {submitError && (
                  <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                    {submitError}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
                  <div>
                    <label htmlFor="learningPace" className={labelStyles.required}>
                      {t.form.learning_pace.label}{' '}
                      <span className={labelStyles.requiredStar}>*</span>
                    </label>
                    <select
                      id="learningPace"
                      required
                      value={formData.learningPace}
                      onChange={handleLearningPaceChange}
                      className={cn(
                        inputStyles.selectWithValue(true),
                        'max-w-md py-2 pl-2.5 pr-8 text-xs sm:text-sm'
                      )}
                      aria-label={t.form.learning_pace.label}
                    >
                      <option value="live_cohort" className="bg-zinc-950 text-xs sm:text-sm text-zinc-50">
                        {t.form.learning_pace.live_cohort}
                      </option>
                      <option value="self_paced" className="bg-zinc-950 text-xs sm:text-sm text-zinc-50">
                        {t.form.learning_pace.self_paced}
                      </option>
                    </select>
                  </div>

                  {formData.learningPace === 'self_paced' ? (
                    <div className="rounded-xl border border-cyan-400/20 bg-zinc-950/50 p-4 text-sm text-zinc-300">
                      <p className="font-medium text-cyan-200 mb-1">{t.form.learning_pace.self_paced_box_title}</p>
                      <p>{t.form.learning_pace.self_paced_box_desc}</p>
                    </div>
                  ) : (
                    <div className="space-y-4 border-b border-zinc-800 pb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-50">{t.form.cohorts.heading}</h3>
                        <p className="mt-1 text-sm text-zinc-500">{t.form.cohorts.subheading}</p>
                      </div>
                      {cohortsLoading ? (
                        <div className="flex items-center justify-center py-12 text-cyan-400">{t.form.cohorts.loading}</div>
                      ) : cohortsError ? (
                        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-300">
                          {cohortsError}
                        </div>
                      ) : cohorts.length === 0 ? (
                        <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/30 py-12 text-center text-zinc-400">
                          {t.form.cohorts.empty}
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-l from-zinc-950/90 to-transparent z-10" aria-hidden />
                          <div
                            className="overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide py-2 -mx-2 px-2 sm:-mx-4 sm:px-4"
                            style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
                          >
                            <div className="flex gap-5 w-max min-w-full pb-1">
                              {cohorts.map((cohort, index) => {
                                const statusLower = (cohort.status || '').toLowerCase();
                                const isCompleted = statusLower === 'completed' || statusLower === 'ended';
                                const isActive = statusLower === 'active' || statusLower === 'live';
                                const isUpcoming = statusLower === 'upcoming' || (!isCompleted && !isActive);
                                const seatsPct = cohort.seats ? Math.round((cohort.available / cohort.seats) * 100) : 0;
                                const levelLabel = cohort.level ? cohort.level.charAt(0).toUpperCase() + cohort.level.slice(1).toLowerCase() : 'Beginner';
                                const isCardSelected = selectedCohort === cohort.id;

                                return (
                                  <div
                                    key={cohort.id}
                                    className={cn(
                                      "cohort-card-entrance flex-shrink-0 w-[88vw] sm:w-[44vw] lg:w-[340px] transition-all duration-300 scroll-ml-4 sm:scroll-ml-6 rounded-2xl overflow-hidden",
                                      isCardSelected &&
                                        "ring-2 ring-amber-400/90 ring-offset-2 ring-offset-zinc-950 shadow-[0_0_36px_rgba(245,158,11,0.35),0_0_72px_rgba(234,179,8,0.12)]"
                                    )}
                                    style={{ scrollSnapAlign: 'start', animationDelay: `${index * 80}ms` }}
                                  >
                                    <div
                                      className={cn(
                                        "h-full rounded-2xl border bg-zinc-900/90 p-5 flex flex-col transition-[box-shadow,border-color] duration-300",
                                        isCardSelected &&
                                          "border-amber-400/75 shadow-[inset_0_0_0_1px_rgba(251,191,36,0.2),0_0_28px_rgba(245,158,11,0.18)]",
                                        !isCardSelected && isCompleted && "border-zinc-700/60 opacity-80",
                                        !isCardSelected && isActive && "border-emerald-500/40 shadow-[0_0_24px_rgba(16,185,129,0.12)]",
                                        !isCardSelected && isUpcoming && !isCompleted && "border-cyan-400/30"
                                      )}
                                    >
                                      <div className="flex items-center justify-between gap-2 mb-4">
                                        <span
                                          className={cn(
                                            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
                                            isCompleted && "bg-zinc-600/40 text-zinc-400",
                                            isActive && "bg-emerald-500/25 text-emerald-300",
                                            isUpcoming && "bg-cyan-500/25 text-cyan-300"
                                          )}
                                        >
                                          {isActive && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                                          {isCompleted ? t.form.cohorts.status_completed : isActive ? t.form.cohorts.status_active : t.form.cohorts.status_upcoming}
                                        </span>
                                        <span
                                          className={cn(
                                            "rounded-full px-2.5 py-1 text-xs font-medium",
                                            cohort.level?.toLowerCase() === 'intermediate' && "bg-amber-500/20 text-amber-300",
                                            cohort.level?.toLowerCase() === 'advanced' && "bg-purple-500/20 text-purple-300",
                                            (cohort.level?.toLowerCase() === 'beginner' || !cohort.level) && "bg-blue-500/20 text-blue-300",
                                            cohort.level?.toLowerCase() && !['beginner', 'intermediate', 'advanced'].includes(cohort.level?.toLowerCase()) && "bg-cyan-500/20 text-cyan-300"
                                          )}
                                        >
                                          {levelLabel}
                                        </span>
                                      </div>

                                      <h3 className="text-lg font-bold text-zinc-50 mb-1">{cohort.name}</h3>
                                      <p className="text-sm text-zinc-500 mb-4">
                                        {cohort.startDate} → {cohort.endDate}
                                      </p>

                                      <div className="flex items-center gap-4 text-sm mb-4">
                                        <span className="text-zinc-400">
                                          <span className="font-semibold text-zinc-200">{cohort.sessions}</span> {t.form.cohorts.sessions_suffix}
                                        </span>
                                        <span className="text-zinc-500">·</span>
                                        <span
                                          className={
                                            cohort.available === 0
                                              ? "text-zinc-500"
                                              : isCardSelected
                                                ? "text-amber-400"
                                                : "text-cyan-400"
                                          }
                                        >
                                          <span className="font-semibold">{cohort.available}</span> / {cohort.seats} {t.form.cohorts.seats_suffix}
                                        </span>
                                      </div>

                                      <div className="mb-4 h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                                        <div
                                          className={cn(
                                            "h-full rounded-full transition-all",
                                            cohort.available === 0 && "bg-zinc-600",
                                            cohort.available > 0 && seatsPct <= 20 && "bg-amber-500/80",
                                            cohort.available > 0 && seatsPct > 20 && !isCardSelected && "bg-cyan-500/80",
                                            cohort.available > 0 && seatsPct > 20 && isCardSelected && "bg-gradient-to-r from-amber-500 to-amber-400"
                                          )}
                                          style={{ width: `${100 - seatsPct}%` }}
                                          aria-hidden
                                        />
                                      </div>

                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          if (cohort.available === 0) return;
                                          setSelectedCohort(cohort.id);
                                          const normalizedLevel = normalizeLevel(cohort.level);
                                          setFormData((prev) => ({
                                            ...prev,
                                            preferredCohort: cohort.id,
                                            experienceLevel: normalizedLevel,
                                          }));
                                        }}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        disabled={cohort.available === 0}
                                        className={cn(
                                          "mt-auto w-full rounded-xl py-3 text-sm font-semibold transition-all duration-300",
                                          cohort.available === 0
                                            ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
                                            : isCardSelected
                                              ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-[0_0_24px_rgba(245,158,11,0.45)] hover:from-amber-300 hover:to-amber-400"
                                              : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                                        )}
                                      >
                                        {cohort.available === 0
                                          ? t.form.cohorts.btn_full
                                          : isCardSelected
                                            ? t.form.cohorts.btn_selected
                                            : t.form.cohorts.btn_select}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* First Name and Last Name */}
                  <FormGrid>
                    <div>
                      <label htmlFor="firstName" className={labelStyles.required}>
                        {t.form.personal_details.first_name_label} <span className={labelStyles.requiredStar}>*</span>
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full rounded-lg border border-cyan-400/30 bg-zinc-950 px-3 py-2.5 text-base sm:text-sm text-zinc-50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 cursor-text"
                        placeholder={t.form.personal_details.first_name_placeholder}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className={labelStyles.required}>
                        {t.form.personal_details.last_name_label} <span className={labelStyles.requiredStar}>*</span>
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full rounded-lg border border-cyan-400/30 bg-zinc-950 px-3 py-2.5 text-base sm:text-sm text-zinc-50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 cursor-text"
                        placeholder={t.form.personal_details.last_name_placeholder}
                      />
                    </div>
                  </FormGrid>

                  {/* Email, Phone, Birth Date, Language */}
                  <FormGrid>
                    <div>
                      <label htmlFor="email" className={labelStyles.required}>
                        {t.form.personal_details.email_label} <span className={labelStyles.requiredStar}>*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={inputStyles.base}
                        placeholder={t.form.personal_details.email_placeholder}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelStyles.required}>
                        {t.form.personal_details.phone_label} <span className={labelStyles.requiredStar}>*</span>
                      </label>
                      <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 w-full">
                        <div ref={codeDropdownRef} className="relative w-full sm:w-auto sm:shrink-0">
                          <button
                            type="button"
                            onClick={() => { setCodeDropdownOpen(!codeDropdownOpen); setCodeSearch(""); }}
                            className="flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-zinc-950 px-2.5 py-2.5 text-sm text-zinc-50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 cursor-pointer hover:border-cyan-400/50 transition w-full sm:min-w-[90px] sm:w-auto"
                            aria-label="Country code"
                          >
                            {selectedCountryCode ? (
                              <>
                                <span>{sortedCountries.find(c => c.code === selectedCountryCode)?.flag}</span>
                                <span className="font-mono text-xs">{selectedCountryCode}</span>
                                <svg className="h-3 w-3 text-zinc-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                              </>
                            ) : (
                              <>
                                <span className="text-zinc-500 text-xs">{t.form.personal_details.phone_code_btn}</span>
                                <svg className="h-3 w-3 text-zinc-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                              </>
                            )}
                          </button>

                          {codeDropdownOpen && (
                            <div className="absolute left-0 top-full z-50 mt-1 w-full sm:w-64 rounded-lg border border-cyan-400/30 bg-zinc-950 shadow-xl shadow-black/50 overflow-hidden">
                              <div className="p-2 border-b border-zinc-800">
                                <input
                                  type="text"
                                  value={codeSearch}
                                  onChange={(e) => setCodeSearch(e.target.value)}
                                  placeholder={t.form.personal_details.phone_code_search_placeholder}
                                  autoFocus
                                  className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none"
                                />
                              </div>
                              <div className="max-h-52 overflow-y-auto">
                                {sortedCountries
                                  .filter(c => {
                                    if (!codeSearch) return true;
                                    const q = codeSearch.toLowerCase();
                                    return c.name.toLowerCase().includes(q) || c.code.includes(q);
                                  })
                                  .map((country) => (
                                    <button
                                      key={country.name}
                                      type="button"
                                      onClick={() => {
                                        setSelectedCountryCode(country.code);
                                        setSelectedCountry(country.name);
                                        setFormData(prev => ({ ...prev, country: country.name }));
                                        setPhoneError(null);
                                        setCodeDropdownOpen(false);
                                        setCodeSearch("");
                                        if (phoneNumber.replace(/\D/g, '').length > 0) {
                                          validateWhatsAppNumber(country.code, phoneNumber, false);
                                        }
                                      }}
                                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-cyan-500/10 ${selectedCountryCode === country.code ? 'bg-cyan-500/10 text-cyan-300' : 'text-zinc-300'}`}
                                    >
                                      <span className="text-base">{country.flag}</span>
                                      <span className="flex-1 truncate">{country.name}</span>
                                      <span className="font-mono text-xs text-zinc-500">{country.code}</span>
                                    </button>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="relative w-full sm:flex-1 sm:min-w-0">
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel-national"
                            required
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            onBlur={handlePhoneBlur}
                            maxLength={15}
                            className={`w-full rounded-lg border border-cyan-400/30 bg-zinc-950 px-3 py-2.5 sm:py-2 text-base sm:text-sm text-zinc-50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 cursor-text min-w-0 ${phoneValid ? 'border-green-500/50 focus:border-green-500/60 focus:ring-green-500/20' : ''} ${phoneError ? 'border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20' : ''} pr-9`}
                            placeholder={t.form.personal_details.phone_placeholder}
                            aria-describedby={phoneError ? "phone-error" : undefined}
                          />
                          {phoneValid && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                            </span>
                          )}
                          {phoneError && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                            </span>
                          )}
                        </div>
                      </div>
                      {phoneError && (
                        <p id="phone-error" className="mt-1 text-xs text-red-300" role="alert">{phoneError}</p>
                      )}
                      {phoneValid && (
                        <p className="mt-1 text-xs text-green-400/80">{t.form.personal_details.phone_valid}</p>
                      )}
                    </div>
                    <DatePicker
                      label={t.form.personal_details.birth_date_label}
                      value={formData.birthDate}
                      onChange={(v) => {
                        setBirthDate(v);
                        setFormData({ ...formData, birthDate: v });
                      }}
                      placeholder={t.form.personal_details.birth_date_placeholder}
                      required
                      maxDate={new Date()}
                      inputClassName="border-cyan-400/30 bg-zinc-950 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                    />
                    <div>
                      <label htmlFor="preferredLanguage" className={labelStyles.required}>
                        {t.form.personal_details.preferred_language_label} <span className={labelStyles.requiredStar}>*</span>
                      </label>
                      <select
                        id="preferredLanguage"
                        required
                        value={formData.preferredLanguage}
                        onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                        className={inputStyles.select}
                        aria-label={t.form.personal_details.preferred_language_label}
                      >
                        <option value="" className="bg-zinc-950 text-zinc-400">{t.form.personal_details.select_language_placeholder}</option>
                        <option value="english" className="bg-zinc-950 text-zinc-50">{t.form.personal_details.language_english}</option>
                        <option value="tigrigna" className="bg-zinc-950 text-zinc-50">{t.form.personal_details.language_tigrinya}</option>
                      </select>
                    </div>
                  </FormGrid>

                  {/* Country and City */}
                  <FormGrid>
                    <div>
                      <label htmlFor="country" className={labelStyles.required}>
                        {t.form.personal_details.country_label} <span className={labelStyles.requiredStar}>*</span>
                      </label>
                      <select
                        id="country"
                        name="country"
                        autoComplete="country-name"
                        required
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        className={inputStyles.select}
                      >
                        <option value="" className="bg-zinc-950 text-zinc-400">{t.form.personal_details.country_placeholder}</option>
                        {sortedCountries.map((country) => (
                          <option key={country.name} value={country.name} className="bg-zinc-950 text-zinc-50">
                            {country.flag} {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="city" className={labelStyles.required}>
                        {t.form.personal_details.city_label} <span className="text-zinc-500 text-xs">{t.form.personal_details.optional_label}</span>
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        autoComplete="address-level2"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className={inputStyles.optional}
                        placeholder={t.form.personal_details.city_placeholder}
                      />
                    </div>
                  </FormGrid>

                  {/* Experience level; live cohort also picks preferred cohort here */}
                  {formData.learningPace === 'self_paced' ? (
                    <FormGrid cols={1}>
                      <div>
                        <label htmlFor="experienceLevel" className={labelStyles.required}>
                          {t.form.experience.label} <span className={labelStyles.requiredStar}>*</span>
                        </label>
                        <select
                          id="experienceLevel"
                          required
                          value={formData.experienceLevel}
                          onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                          className={inputStyles.selectWithValue(!!formData.experienceLevel)}
                        >
                          <option value="" className="bg-zinc-950 text-zinc-400">{t.form.experience.placeholder}</option>
                          <option
                            value="beginner"
                            className={`bg-zinc-950 ${
                              formData.experienceLevel === 'beginner' ? 'text-green-400' : 'text-zinc-50'
                            }`}
                          >
                            {t.form.experience.beginner}
                          </option>
                          <option
                            value="intermediate"
                            className={`bg-zinc-950 ${
                              formData.experienceLevel === 'intermediate' ? 'text-green-400' : 'text-zinc-50'
                            }`}
                          >
                            {t.form.experience.intermediate}
                          </option>
                          <option
                            value="advanced"
                            className={`bg-zinc-950 ${
                              formData.experienceLevel === 'advanced' ? 'text-green-400' : 'text-zinc-50'
                            }`}
                          >
                            {t.form.experience.advanced}
                          </option>
                        </select>
                      </div>
                    </FormGrid>
                  ) : (
                    <FormGrid>
                      <div>
                        <label htmlFor="experienceLevel" className={labelStyles.required}>
                          {t.form.experience.label} <span className={labelStyles.requiredStar}>*</span>
                        </label>
                        <select
                          id="experienceLevel"
                          required
                          value={formData.experienceLevel}
                          onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                          className={inputStyles.selectWithValue(!!formData.experienceLevel)}
                        >
                          <option value="" className="bg-zinc-950 text-zinc-400">{t.form.experience.placeholder}</option>
                          <option
                            value="beginner"
                            className={`bg-zinc-950 ${
                              formData.experienceLevel === 'beginner' ? 'text-green-400' : 'text-zinc-50'
                            }`}
                          >
                            {t.form.experience.beginner}
                          </option>
                          <option
                            value="intermediate"
                            className={`bg-zinc-950 ${
                              formData.experienceLevel === 'intermediate' ? 'text-green-400' : 'text-zinc-50'
                            }`}
                          >
                            {t.form.experience.intermediate}
                          </option>
                          <option
                            value="advanced"
                            className={`bg-zinc-950 ${
                              formData.experienceLevel === 'advanced' ? 'text-green-400' : 'text-zinc-50'
                            }`}
                          >
                            {t.form.experience.advanced}
                          </option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="preferredCohort" className={labelStyles.required}>
                          {t.form.preferred_cohort.label} <span className={labelStyles.requiredStar}>*</span>
                        </label>
                        <select
                          id="preferredCohort"
                          required
                          value={formData.preferredCohort}
                          onChange={(e) => {
                            const cohortId = e.target.value;
                            const cohortOpt = cohorts.find((c) => c.id === cohortId);
                            const normalizedLevel = normalizeLevel(cohortOpt?.level);
                            setFormData({
                              ...formData,
                              preferredCohort: cohortId,
                              experienceLevel: normalizedLevel,
                            });
                            setSelectedCohort(cohortId || null);
                          }}
                          className={cn(inputStyles.select, formData.preferredCohort ? 'text-green-400' : 'text-zinc-50')}
                        >
                          <option value="" className="bg-zinc-950 text-zinc-400">{t.form.preferred_cohort.placeholder}</option>
                          {cohorts.map((cohort) => (
                            <option
                              key={cohort.id}
                              value={cohort.id}
                              disabled={cohort.available === 0}
                              className={`bg-zinc-950 ${
                                cohort.available === 0
                                  ? 'text-zinc-600 cursor-not-allowed'
                                  : formData.preferredCohort === cohort.id.toString()
                                    ? 'text-green-400'
                                    : 'text-zinc-50'
                              }`}
                            >
                              {cohort.name} ({cohort.available === 0 ? t.form.preferred_cohort.full : `${cohort.available} ${t.form.preferred_cohort.seats_available}`})
                            </option>
                          ))}
                        </select>
                      </div>
                    </FormGrid>
                  )}

                  <div className="rounded-lg border border-cyan-400/20 bg-cyan-500/5 p-4">
                    <p className="text-sm text-zinc-300">
                      <span className="font-semibold text-cyan-300">{t.form.note.prefix}</span>
                      {t.form.note.text}
                    </p>
                  </div>

                  <div className="flex justify-center pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex min-h-[48px] min-w-[180px] items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 px-8 py-3.5 text-base font-semibold text-black shadow-lg shadow-cyan-500/20 transition hover:from-cyan-300 hover:to-cyan-400 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:from-cyan-400 disabled:hover:to-cyan-500"
                    >
                      {submitting ? t.form.submitting_button : t.form.submit_button}
                    </button>
                  </div>

                  <div className="rounded-xl border border-zinc-700/60 bg-zinc-950/60 p-4 sm:p-5 space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-zinc-100">{t.form.community_connect.whatsapp_heading}</p>
                      <p className="mt-1 text-xs text-zinc-400">
                        {t.form.community_connect.whatsapp_subtext}
                      </p>
                    </div>
                    <a
                      href={whatsappGroupLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-300 transition hover:border-green-400/50 hover:bg-green-500/20"
                    >
                      {t.form.community_connect.whatsapp_button}
                    </a>

                    <div>
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                        {t.form.community_connect.social_heading}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {applySocialLinks.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md border border-cyan-400/25 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 transition hover:border-cyan-300/45 hover:bg-cyan-500/20"
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </form>
              </section>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
