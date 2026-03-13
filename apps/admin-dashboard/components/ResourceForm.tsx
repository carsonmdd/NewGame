'use client';

import { useState } from 'react';
import { Resource, ResourceInput } from '@/types/resource';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	X,
	Save,
	Trash2,
	Tag as TagIcon,
	Globe,
	User,
	BookOpen,
	Calendar,
	Shield,
	MessageSquare,
	Target,
	Clock,
	Star,
	Search,
} from 'lucide-react';

interface Props {
	initialData?: ResourceInput;
	resource?: Resource | null;
	isEditing?: boolean;
	onSubmit: (data: ResourceInput) => void;
	onCancel: () => void;
	onDelete?: () => void;
}

export default function ResourceForm({
	initialData,
	resource,
	onSubmit,
	onCancel,
	onDelete,
}: Props) {
	const defaults: ResourceInput = {
		url: '',
		title: '',
		source: '',
		author: '',
		date: '',
		license: '',
		centralClaim: '',
		coreKnowledge: '',
		practicalTakeaway: '',
		topicPosition: '',
		openQuestions: '',
		audience: '',
		decisionMoment: '',
		evergreen: '',
		sourceType: '',
		credibilityNotes: '',
		keywords: [],
		adjacentTopics: [],
		syntheticQuery1: '',
		syntheticQuery2: '',
		syntheticQuery3: '',
		saveCount: 0,
	};

	const [formData, setFormData] = useState<ResourceInput>({
		...defaults,
		...(initialData || {}),
	});

	const [tagInput, setTagInput] = useState('');
	const [topicInput, setTopicInput] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
	};

	const addListMember = (
		field: 'keywords' | 'adjacentTopics',
		value: string,
		setter: (v: string) => void,
	) => {
		const trimmed = value.trim();
		if (!trimmed) return;
		if (formData[field].includes(trimmed)) {
			setter('');
			return;
		}
		setFormData((prev) => ({
			...prev,
			[field]: [...prev[field], trimmed],
		}));
		setter('');
	};

	const removeListMember = (
		field: 'keywords' | 'adjacentTopics',
		member: string,
	) => {
		setFormData((prev) => ({
			...prev,
			[field]: prev[field].filter((t) => t !== member),
		}));
	};

	return (
		<div className="relative w-full max-w-5xl mx-auto">
			<form
				onSubmit={handleSubmit}
				className="bg-[#0a0a0c] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
			>
				<header className="flex items-center justify-between p-6 md:p-8 border-b border-white/10 bg-white/2">
					<div>
						<h2 className="text-2xl font-semibold tracking-tight text-foreground">
							{resource ? 'Edit Record' : 'Create New Record'}
						</h2>
						<p className="text-sm text-muted-foreground mt-1 font-mono uppercase tracking-wider text-[10px]">
							Resource ID: {resource?.id || 'NEW_RECORD'}
						</p>
					</div>
				</header>

				<div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-12 custom-scrollbar">
					{/* Section 1: Identity */}
					<section className="space-y-6">
						<div className="flex items-center gap-2 pb-2 border-b border-white/5">
							<Globe className="size-4 text-accent-blue" />
							<h3 className="text-sm font-semibold uppercase tracking-widest text-foreground/50">
								Identity & Source
							</h3>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2 md:col-span-2">
								<label className="text-xs font-medium text-muted-foreground">
									URL
								</label>
								<Input
									value={formData.url}
									onChange={(e) =>
										setFormData({
											...formData,
											url: e.target.value,
										})
									}
									placeholder="https://..."
									required
								/>
							</div>
							<div className="space-y-2 md:col-span-2">
								<label className="text-xs font-medium text-muted-foreground">
									Title
								</label>
								<Input
									value={formData.title}
									onChange={(e) =>
										setFormData({
											...formData,
											title: e.target.value,
										})
									}
									placeholder="Resource title"
									required
								/>
							</div>
							<div className="space-y-2">
								<label className="text-xs font-medium text-muted-foreground">
									Author
								</label>
								<div className="relative">
									<User className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
									<Input
										className="pl-9"
										value={formData.author}
										onChange={(e) =>
											setFormData({
												...formData,
												author: e.target.value,
											})
										}
										placeholder="Author name"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<label className="text-xs font-medium text-muted-foreground">
									Source
								</label>
								<div className="relative">
									<BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
									<Input
										className="pl-9"
										value={formData.source}
										onChange={(e) =>
											setFormData({
												...formData,
												source: e.target.value,
											})
										}
										placeholder="Publisher/Site"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<label className="text-xs font-medium text-muted-foreground">
									Date
								</label>
								<div className="relative">
									<Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
									<Input
										className="pl-9"
										value={formData.date}
										onChange={(e) =>
											setFormData({
												...formData,
												date: e.target.value,
											})
										}
										placeholder="YYYY-MM-DD"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<label className="text-xs font-medium text-muted-foreground">
									License
								</label>
								<div className="relative">
									<Shield className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
									<Input
										className="pl-9"
										value={formData.license}
										onChange={(e) =>
											setFormData({
												...formData,
												license: e.target.value,
											})
										}
										placeholder="Copyright/CC"
									/>
								</div>
							</div>
						</div>
					</section>

					{/* Section 2: Content Summary */}
					<section className="space-y-6">
						<div className="flex items-center gap-2 pb-2 border-b border-white/5">
							<MessageSquare className="size-4 text-accent-blue" />
							<h3 className="text-sm font-semibold uppercase tracking-widest text-foreground/50">
								Core Insights
							</h3>
						</div>
						<div className="space-y-6">
							<div className="space-y-2">
								<label className="text-xs font-medium text-muted-foreground">
									Central Claim
								</label>
								<textarea
									value={formData.centralClaim}
									onChange={(e) =>
										setFormData({
											...formData,
											centralClaim: e.target.value,
										})
									}
									className="w-full min-h-[80px] rounded-lg border border-white/10 bg-[#0F0F12] px-3 py-2 text-sm text-foreground focus:border-accent-blue/50 outline-none transition-all"
									placeholder="What is the main argument?"
								/>
							</div>
							<div className="space-y-2">
								<label className="text-xs font-medium text-muted-foreground">
									Core Knowledge
								</label>
								<textarea
									value={formData.coreKnowledge}
									onChange={(e) =>
										setFormData({
											...formData,
											coreKnowledge: e.target.value,
										})
									}
									className="w-full min-h-[120px] rounded-lg border border-white/10 bg-[#0F0F12] px-3 py-2 text-sm text-foreground focus:border-accent-blue/50 outline-none transition-all"
									placeholder="Detailed explanation..."
								/>
							</div>
							<div className="space-y-2">
								<label className="text-xs font-medium text-muted-foreground">
									Practical Takeaway
								</label>
								<textarea
									value={formData.practicalTakeaway}
									onChange={(e) =>
										setFormData({
											...formData,
											practicalTakeaway: e.target.value,
										})
									}
									className="w-full min-h-[80px] rounded-lg border border-white/10 bg-[#0F0F12] px-3 py-2 text-sm text-foreground focus:border-accent-blue/50 outline-none transition-all"
									placeholder="Actionable advice..."
								/>
							</div>
						</div>
					</section>

					{/* Section 3: Analysis & Context */}
					<section className="space-y-6">
						<div className="flex items-center gap-2 pb-2 border-b border-white/5">
							<Target className="size-4 text-accent-blue" />
							<h3 className="text-sm font-semibold uppercase tracking-widest text-foreground/50">
								Analysis & Context
							</h3>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<label className="text-xs font-medium text-muted-foreground">
									Topic Position
								</label>
								<Input
									value={formData.topicPosition}
									onChange={(e) =>
										setFormData({
											...formData,
											topicPosition: e.target.value,
										})
									}
									placeholder="How does it fit in the field?"
								/>
							</div>
							<div className="space-y-2">
								<label className="text-xs font-medium text-muted-foreground">
									Source Type
								</label>
								<Input
									value={formData.sourceType}
									onChange={(e) =>
										setFormData({
											...formData,
											sourceType: e.target.value,
										})
									}
									placeholder="Report/Opinion/Research"
								/>
							</div>
							<div className="space-y-2 md:col-span-2">
								<label className="text-xs font-medium text-muted-foreground">
									Credibility Notes
								</label>
								<textarea
									value={formData.credibilityNotes}
									onChange={(e) =>
										setFormData({
											...formData,
											credibilityNotes: e.target.value,
										})
									}
									className="w-full min-h-[60px] rounded-lg border border-white/10 bg-[#0F0F12] px-3 py-2 text-sm text-foreground focus:border-accent-blue/50 outline-none transition-all"
									placeholder="Why trust this source?"
								/>
							</div>
						</div>
					</section>

					{/* Section 4: Targeting */}
					<section className="space-y-6">
						<div className="flex items-center gap-2 pb-2 border-b border-white/5">
							<Clock className="size-4 text-accent-blue" />
							<h3 className="text-sm font-semibold uppercase tracking-widest text-foreground/50">
								Usage & Targeting
							</h3>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<label className="text-xs font-medium text-muted-foreground">
									Audience
								</label>
								<Input
									value={formData.audience}
									onChange={(e) =>
										setFormData({
											...formData,
											audience: e.target.value,
										})
									}
									placeholder="Who is this for?"
								/>
							</div>
							<div className="space-y-2">
								<label className="text-xs font-medium text-muted-foreground">
									Decision Moment
								</label>
								<Input
									value={formData.decisionMoment}
									onChange={(e) =>
										setFormData({
											...formData,
											decisionMoment: e.target.value,
										})
									}
									placeholder="When is it useful?"
								/>
							</div>
							<div className="space-y-2">
								<label className="text-xs font-medium text-muted-foreground">
									Evergreen Status
								</label>
								<Input
									value={formData.evergreen}
									onChange={(e) =>
										setFormData({
											...formData,
											evergreen: e.target.value,
										})
									}
									placeholder="Yes/No/Partial"
								/>
							</div>
							<div className="space-y-2">
								<label className="text-xs font-medium text-muted-foreground">
									Open Questions
								</label>
								<Input
									value={formData.openQuestions}
									onChange={(e) =>
										setFormData({
											...formData,
											openQuestions: e.target.value,
										})
									}
									placeholder="What is still unknown?"
								/>
							</div>
						</div>
					</section>

					{/* Section 5: Taxonomy */}
					<section className="space-y-6">
						<div className="flex items-center gap-2 pb-2 border-b border-white/5">
							<Star className="size-4 text-accent-blue" />
							<h3 className="text-sm font-semibold uppercase tracking-widest text-foreground/50">
								Taxonomy
							</h3>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="space-y-3">
								<label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
									<TagIcon className="size-3" />
									Keywords
								</label>
								<div className="flex flex-wrap gap-2 p-3 min-h-[100px] rounded-lg border border-white/10 bg-[#0F0F12]">
									{formData.keywords.map((t) => (
										<span
											key={t}
											className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-[11px] font-medium"
										>
											{t}
											<button
												type="button"
												onClick={() =>
													removeListMember(
														'keywords',
														t,
													)
												}
												className="hover:text-accent-bright transition-colors"
											>
												<X className="size-3" />
											</button>
										</span>
									))}
									<input
										value={tagInput}
										onChange={(e) =>
											setTagInput(e.target.value)
										}
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												e.preventDefault();
												addListMember(
													'keywords',
													tagInput,
													setTagInput,
												);
											}
										}}
										placeholder="Add keyword..."
										className="flex-1 min-w-[80px] bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/30"
									/>
								</div>
							</div>
							<div className="space-y-3">
								<label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
									<BookOpen className="size-3" />
									Adjacent Topics
								</label>
								<div className="flex flex-wrap gap-2 p-3 min-h-[100px] rounded-lg border border-white/10 bg-[#0F0F12]">
									{formData.adjacentTopics.map((t) => (
										<span
											key={t}
											className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] font-medium"
										>
											{t}
											<button
												type="button"
												onClick={() =>
													removeListMember(
														'adjacentTopics',
														t,
													)
												}
												className="hover:text-purple-300 transition-colors"
											>
												<X className="size-3" />
											</button>
										</span>
									))}
									<input
										value={topicInput}
										onChange={(e) =>
											setTopicInput(e.target.value)
										}
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												e.preventDefault();
												addListMember(
													'adjacentTopics',
													topicInput,
													setTopicInput,
												);
											}
										}}
										placeholder="Add topic..."
										className="flex-1 min-w-[80px] bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/30"
									/>
								</div>
							</div>
						</div>
					</section>

					{/* Section 6: Synthetic Search Queries */}
					<section className="space-y-6">
						<div className="flex items-center gap-2 pb-2 border-b border-white/5">
							<Search className="size-4 text-accent-blue" />
							<h3 className="text-sm font-semibold uppercase tracking-widest text-foreground/50">
								Synthetic Search Queries
							</h3>
						</div>
						<div className="space-y-4">
							<div className="flex gap-4 items-center">
								<span className="text-[10px] font-mono text-muted-foreground w-4">
									#1
								</span>
								<Input
									value={formData.syntheticQuery1}
									onChange={(e) =>
										setFormData({
											...formData,
											syntheticQuery1: e.target.value,
										})
									}
									placeholder="Example query users might search..."
								/>
							</div>
							<div className="flex gap-4 items-center">
								<span className="text-[10px] font-mono text-muted-foreground w-4">
									#2
								</span>
								<Input
									value={formData.syntheticQuery2}
									onChange={(e) =>
										setFormData({
											...formData,
											syntheticQuery2: e.target.value,
										})
									}
									placeholder="Example query users might search..."
								/>
							</div>
							<div className="flex gap-4 items-center">
								<span className="text-[10px] font-mono text-muted-foreground w-4">
									#3
								</span>
								<Input
									value={formData.syntheticQuery3}
									onChange={(e) =>
										setFormData({
											...formData,
											syntheticQuery3: e.target.value,
										})
									}
									placeholder="Example query users might search..."
								/>
							</div>
						</div>
					</section>
				</div>

				<footer className="p-6 border-t border-white/10 bg-white/1 flex items-center justify-between">
					{onDelete && (
						<Button
							type="button"
							variant="ghost"
							onClick={onDelete}
							className="text-destructive hover:text-destructive hover:bg-destructive/10"
						>
							<Trash2 className="mr-2 size-4" />
							Delete Record
						</Button>
					)}
					<div className="flex items-center gap-3 ml-auto">
						<Button
							type="button"
							variant="ghost"
							onClick={onCancel}
						>
							Cancel
						</Button>
						<Button type="submit">
							<Save className="mr-2 size-4" />
							{resource ? 'Update Record' : 'Save Record'}
						</Button>
					</div>
				</footer>
			</form>
		</div>
	);
}
