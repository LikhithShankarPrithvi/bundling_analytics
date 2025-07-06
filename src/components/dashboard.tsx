import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface Product {
	product_id: string
	product_name: string
	price: number
	category: string
}

interface BundleRecommendation {
	recommended_bundle: {
		products: Product[]
		discounted_price: number
		discount_rate: number
		synergy_score: number
		expected_value: number
		aov_uplift: number
	}
}

const BundleDashboard: React.FC = () => {
	const [products, setProducts] = useState<Product[]>([])
	const [selectedProducts, setSelectedProducts] = useState<string[]>([])
	const [recommendation, setRecommendation] =
		useState<BundleRecommendation | null>(null)
	const [loader, setLoader] = useState<Boolean>(false)
	const [loader2, setLoader2] = useState<Boolean>(false)

	useEffect(() => {
		setLoader(true)
		axios
			.get<Product[]>(
				'https://bundling-analytics.onrender.com/api/products'
			)
			.then(res => {
				setProducts(res.data)
				console.log(res.data)
				setLoader(false)
			})

			.catch(err => console.error('Error loading products:', err))
	}, [])

	useEffect(() => {
		if (selectedProducts.length > 0) {
			setLoader2(true)
			axios
				.post<BundleRecommendation>(
					'https://bundling-analytics.onrender.com/api/recommend_bundle',
					{
						cart: selectedProducts,
					}
				)
				.then(res => {
					setRecommendation(res.data)
					setLoader2(false)
				})
				.catch(err =>
					console.error('Error fetching recommendation:', err)
				)
		} else {
			setRecommendation(null)
		}
	}, [selectedProducts])

	const toggleProduct = (id: string): void => {
		setLoader2(true)
		setSelectedProducts(prev => {
			const updated = prev.includes(id)
				? prev.filter(pid => pid !== id)
				: [...prev, id]

			// Turn on loader only if there's at least 1 product selected
			setLoader2(updated.length > 0)

			return updated
		})
	}

	// Get selected product details
	const getSelectedProductDetails = () => {
		return products.filter(p => selectedProducts.includes(p.product_id))
	}

	if (loader) {
		return (
			<div className='fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50'>
				<div className='text-center max-w-md px-6'>
					<div className='relative mb-8'>
						<div className='h-20 w-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto' />
						<div
							className='absolute inset-0 h-20 w-20 border-4 border-transparent border-t-blue-500 rounded-full animate-spin mx-auto'
							style={{
								animationDirection: 'reverse',
								animationDuration: '1.5s',
							}}
						/>
					</div>
					<div className='space-y-4'>
						<div className='flex items-center justify-center space-x-3 mb-4'>
							<div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center'>
								<svg
									className='w-6 h-6 text-white'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
									/>
								</svg>
							</div>
							<h1 className='text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'>
								SmartBundle
							</h1>
						</div>
						<p className='text-white/90 text-lg font-medium'>
							Loading AI-Powered Bundle Recommendations...
						</p>
						<p className='text-white/70 text-sm leading-relaxed'>
							SmartBundle leverages advanced AI and machine
							learning to analyze customer behavior and product
							relationships, delivering intelligent bundle
							recommendations that maximize value for both
							customers and businesses.
						</p>
						<div className='mt-6 flex justify-center space-x-4 text-xs text-white/60'>
							<span>🎯 Dynamic Recommendations</span>
							<span>🧠 AI-Powered</span>
							<span>📈 AOV Optimization</span>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
			{/* Header */}
			<div className='w-full bg-white/10 backdrop-blur-sm border-b border-white/20'>
				<div className='w-full px-4 py-6'>
					<div className='flex items-center justify-center space-x-3'>
						<div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center'>
							<svg
								className='w-6 h-6 text-white'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
								/>
							</svg>
						</div>
						<h1 className='text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'>
							SmartBundle
						</h1>
					</div>
					<p className='text-center text-white/70 mt-2 text-lg'>
						AI-Powered Bundle Recommendations
					</p>
				</div>
			</div>

			<div className='w-full px-4 py-8'>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					{/* Left Column - Recommendations */}
					<div className='lg:col-span-2 space-y-6'>
						{/* About Section */}
						<div className='bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl'>
							<div className='flex items-center space-x-3 mb-6'>
								<div className='w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center'>
									<svg
										className='w-5 h-5 text-white'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
										/>
									</svg>
								</div>
								<h2 className='text-2xl font-bold text-white'>
									About SmartBundle
								</h2>
							</div>
							<div className='space-y-4 text-white/80'>
								<p className='text-lg leading-relaxed'>
									SmartBundle leverages advanced AI and
									machine learning to analyze customer
									behavior and product relationships,
									delivering intelligent bundle
									recommendations that maximize value for both
									customers and businesses.
								</p>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
									<div className='bg-white/10 rounded-xl p-4'>
										<h3 className='font-semibold text-white mb-2'>
											🎯 Dynamic Recommendations
										</h3>
										<p className='text-sm text-white/70'>
											Real-time bundle suggestions based
											on cart analysis
										</p>
									</div>
									<div className='bg-white/10 rounded-xl p-4'>
										<h3 className='font-semibold text-white mb-2'>
											🧠 Bayesian Modeling
										</h3>
										<p className='text-sm text-white/70'>
											Advanced synergy calculations using
											historical data
										</p>
									</div>
									<div className='bg-white/10 rounded-xl p-4'>
										<h3 className='font-semibold text-white mb-2'>
											📈 AOV Optimization
										</h3>
										<p className='text-sm text-white/70'>
											Intelligent pricing to maximize
											order value
										</p>
									</div>
									<div className='bg-white/10 rounded-xl p-4'>
										<h3 className='font-semibold text-white mb-2'>
											⚡ Fast API
										</h3>
										<p className='text-sm text-white/70'>
											Lightning-fast recommendations via
											FastAPI
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Selected Products Display */}
						{selectedProducts.length > 0 && (
							<div className='bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-2xl'>
								<div className='flex items-center space-x-3 mb-4'>
									<div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center'>
										<svg
											className='w-5 h-5 text-white'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
											/>
										</svg>
									</div>
									<h2 className='text-xl font-bold text-white'>
										Your Selected Products (
										{selectedProducts.length})
									</h2>
								</div>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
									{getSelectedProductDetails().map(
										(product, index) => (
											<div
												key={product.product_id}
												className='flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/20'
											>
												<div className='flex items-center space-x-3'>
													<div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold'>
														{index + 1}
													</div>
													<div>
														<span className='text-white font-medium text-sm'>
															{
																product.product_name
															}
														</span>
														<p className='text-white/60 text-xs'>
															{product.category}
														</p>
													</div>
												</div>
												<span className='text-white font-bold'>
													₹
													{product.price.toLocaleString()}
												</span>
											</div>
										)
									)}
								</div>
							</div>
						)}

						{/* Bundle Recommendation Card */}
						<div className='bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl'>
							<div className='flex items-center space-x-3 mb-6'>
								<div className='w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center'>
									<svg
										className='w-5 h-5 text-white'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M13 10V3L4 14h7v7l9-11h-7z'
										/>
									</svg>
								</div>
								<h2 className='text-2xl font-bold text-white'>
									Bundle Recommendation
								</h2>
							</div>

							{recommendation &&
							recommendation.recommended_bundle &&
							loader2 == false ? (
								<div className='bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl'>
									<div className='flex items-center space-x-2 mb-4'>
										<div className='w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center'>
											<svg
												className='w-4 h-4 text-white'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M5 13l4 4L19 7'
												/>
											</svg>
										</div>
										<h3 className='font-bold text-xl text-gray-800'>
											Recommended Bundle
										</h3>
									</div>

									<div className='space-y-3 mb-6'>
										{recommendation.recommended_bundle.products.map(
											(p, index) => (
												<div
													key={p.product_id}
													className='flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100'
												>
													<div className='flex items-center space-x-3'>
														<div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold'>
															{index + 1}
														</div>
														<div>
															<span className='text-gray-800 font-medium'>
																{p.product_name}
															</span>
															<p className='text-gray-600 text-sm'>
																{p.category}
															</p>
														</div>
													</div>
													<div className='text-right'>
														<span className='text-2xl font-bold text-gray-800'>
															₹
															{p.price.toLocaleString()}
														</span>
													</div>
												</div>
											)
										)}
									</div>

									<div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200'>
										<div className='bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100'>
											<div className='flex items-center space-x-2 mb-2'>
												<div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center'>
													<svg
														className='w-4 h-4 text-white'
														fill='none'
														stroke='currentColor'
														viewBox='0 0 24 24'
													>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
														/>
													</svg>
												</div>
												<span className='font-semibold text-gray-700'>
													Discount
												</span>
											</div>
											<span className='text-2xl font-bold text-blue-600'>
												{(
													recommendation
														.recommended_bundle
														.discount_rate * 100
												).toFixed(1)}
												%
											</span>
										</div>

										<div className='bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100'>
											<div className='flex items-center space-x-2 mb-2'>
												<div className='w-6 h-6 bg-green-500 rounded-full flex items-center justify-center'>
													<svg
														className='w-4 h-4 text-white'
														fill='none'
														stroke='currentColor'
														viewBox='0 0 24 24'
													>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M13 10V3L4 14h7v7l9-11h-7z'
														/>
													</svg>
												</div>
												<span className='font-semibold text-gray-700'>
													Synergy Score
												</span>
											</div>
											<span className='text-2xl font-bold text-green-600'>
												{recommendation.recommended_bundle.synergy_score.toFixed(
													4
												)}
											</span>
										</div>

										<div className='bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100'>
											<div className='flex items-center space-x-2 mb-2'>
												<div className='w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center'>
													<svg
														className='w-4 h-4 text-white'
														fill='none'
														stroke='currentColor'
														viewBox='0 0 24 24'
													>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
														/>
													</svg>
												</div>
												<span className='font-semibold text-gray-700'>
													Expected Value
												</span>
											</div>
											<span className='text-2xl font-bold text-purple-600'>
												₹
												{recommendation.recommended_bundle.expected_value.toLocaleString()}
											</span>
										</div>

										<div className='bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100'>
											<div className='flex items-center space-x-2 mb-2'>
												<div className='w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center'>
													<svg
														className='w-4 h-4 text-white'
														fill='none'
														stroke='currentColor'
														viewBox='0 0 24 24'
													>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
														/>
													</svg>
												</div>
												<span className='font-semibold text-gray-700'>
													AOV Uplift
												</span>
											</div>
											<span className='text-2xl font-bold text-orange-600'>
												{recommendation.recommended_bundle.aov_uplift.toFixed(
													1
												)}
												%
											</span>
										</div>
									</div>
								</div>
							) : (
								<div className='bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center'>
									{loader2 ? (
										<div className='flex flex-col items-center justify-center space-y-4'>
											<div className='relative'>
												<div className='h-12 w-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin' />
												<div
													className='absolute inset-0 h-12 w-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin'
													style={{
														animationDirection:
															'reverse',
													}}
												/>
											</div>
											<p className='text-white/80 text-lg'>
												Analyzing bundle
												recommendations...
											</p>
										</div>
									) : (
										<div className='space-y-4'>
											<div className='w-16 h-16 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto'>
												<svg
													className='w-8 h-8 text-white/50'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
													/>
												</svg>
											</div>
											<p className='text-white/70 text-lg'>
												Select products to see
												AI-powered recommendations
											</p>
										</div>
									)}
								</div>
							)}
						</div>
					</div>

					{/* Right Column - Product Selection */}
					<div className='lg:col-span-1'>
						<div className='bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl sticky top-8'>
							<div className='flex items-center space-x-3 mb-6'>
								<div className='w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center'>
									<svg
										className='w-5 h-5 text-white'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
										/>
									</svg>
								</div>
								<h2 className='text-2xl font-bold text-white'>
									Select Products
								</h2>
							</div>

							{selectedProducts.length > 0 && (
								<div className='mb-6 p-4 bg-white/10 rounded-xl'>
									<p className='text-white/80 text-sm mb-2'>
										Selected: {selectedProducts.length}{' '}
										items
									</p>
									<div className='w-full bg-white/20 rounded-full h-2'>
										<div
											className='bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300'
											style={{
												width: `${Math.min(
													(selectedProducts.length /
														5) *
														100,
													100
												)}%`,
											}}
										></div>
									</div>
								</div>
							)}

							<div className='grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-2'>
								{products.map(product => (
									<div
										key={product.product_id}
										onClick={() =>
											toggleProduct(product.product_id)
										}
										className={`cursor-pointer p-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
											selectedProducts.includes(
												product.product_id
											)
												? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-2 border-purple-400 shadow-lg'
												: 'bg-white/10 border border-white/20 hover:bg-white/20'
										}`}
									>
										<div className='flex items-center justify-between'>
											<div className='flex-1'>
												<h3 className='font-semibold text-white text-sm leading-tight mb-1'>
													{product.product_name}
												</h3>
												<p className='text-white/70 text-xs mb-2'>
													{product.category}
												</p>
												<div className='flex items-center space-x-2'>
													<span className='text-lg font-bold text-white'>
														₹
														{product.price.toLocaleString()}
													</span>
													{selectedProducts.includes(
														product.product_id
													) && (
														<div className='w-5 h-5 bg-green-500 rounded-full flex items-center justify-center'>
															<svg
																className='w-3 h-3 text-white'
																fill='none'
																stroke='currentColor'
																viewBox='0 0 24 24'
															>
																<path
																	strokeLinecap='round'
																	strokeLinejoin='round'
																	strokeWidth={
																		2
																	}
																	d='M5 13l4 4L19 7'
																/>
															</svg>
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default BundleDashboard
