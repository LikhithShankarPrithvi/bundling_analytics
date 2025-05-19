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
	if (loader) {
		return (
			<div className='fixed inset-0 flex items-center justify-center z-50'>
				<div className='h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin' />
			</div>
		)
	}
	return (
		<div className='p-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
			<div>
				<div className='p-4 '>
					<h1 className='text-2xl text-center font-bold text-gray-100'>
						SmartBundle
					</h1>
				</div>
				<div className='p-2'>
					<h2 className='text-xl font-semibold mb-2'>
						Bundle Recommendation
					</h2>
					{recommendation &&
					recommendation.recommended_bundle &&
					loader2 == false ? (
						<div className='bg-white p-6 rounded-lg shadow-lg'>
							<h3 className='font-bold text-lg mb-4 text-gray-900'>
								Recommended Bundle:
							</h3>
							<ul className='space-y-2 mb-4'>
								{recommendation.recommended_bundle.products.map(
									p => (
										<li
											key={p.product_id}
											className='flex justify-between items-center'
										>
											<span className='text-gray-700'>
												{p.product_name}
											</span>
											<span className='text-gray-600'>
												₹{p.price.toLocaleString()}
											</span>
										</li>
									)
								)}
							</ul>
							<div className='space-y-2 pt-4 border-t border-gray-200'>
								<p className='flex justify-between'>
									<span className='font-semibold text-gray-700'>
										Discount Percentage Offered:
									</span>
									<span className='text-blue-600 font-medium'>
										{(
											recommendation.recommended_bundle
												.discount_rate * 100
										).toLocaleString()}
										%
									</span>
								</p>
								<p className='flex justify-between'>
									<span className='font-semibold text-gray-700'>
										Synergy Score:
									</span>
									<span className='text-green-600 font-medium'>
										{
											recommendation.recommended_bundle
												.synergy_score
										}
									</span>
								</p>
								<p className='flex justify-between'>
									<span className='font-semibold text-gray-700'>
										Expected Order Value:
									</span>
									<span className='text-purple-600 font-medium'>
										₹
										{recommendation.recommended_bundle.expected_value.toLocaleString()}
									</span>
								</p>
								<p className='flex justify-between'>
									<span className='font-semibold text-gray-700'>
										AOV Uplift(%):
									</span>
									<span className='text-purple-600 font-medium'>
										{recommendation.recommended_bundle.aov_uplift.toLocaleString()}
										%
									</span>
								</p>
							</div>
						</div>
					) : (
						<div className='bg-gray-50 p-6 rounded-lg text-center'>
							{loader2 ? (
								<div className='flex flex-col items-center justify-center space-y-4'>
									<div className='h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin' />
									<p className='text-gray-600'>
										Analyzing bundle recommendations...
									</p>
								</div>
							) : (
								<p className='text-gray-500'>
									Select products to see recommendation.
								</p>
							)}
						</div>
					)}
				</div>
				<div className='bg-white p-6 rounded-lg shadow-lg m-4'>
					<h2 className='text-xl font-semibold mb-4 text-gray-600'>
						About This App
					</h2>
					<div className='space-y-4 text-gray-600'>
						<p>
							SmartBundle is a recommendation engine that
							leverages customer cart behavior and product synergy
							to intelligently suggest high-conversion bundles,
							aiming to increase Average Order Value (AOV) and
							cross-sell efficiency.
						</p>
						<div className='space-y-2'>
							<h3 className='font-semibold text-gray-800'>
								Key Features:
							</h3>
							<ul className='list-disc pl-5 space-y-1'>
								<li>
									Dynamic Bundle Recommendations: Recommends
									the most synergistic bundle based on the
									user's current cart.
								</li>
								<li>
									Bayesian Synergy Modeling: Calculates
									product compatibility using historical
									co-purchase and interaction patterns.
								</li>
								<li>
									Expected Value & AOV Uplift Estimation:
									Projects how much each bundle could increase
									average order value (AOV).
								</li>
								<li>
									Synergy Scoring using co-purchase frequency
									and historical affinity
								</li>
								API-Driven Architecture: Clean separation of
								frontend and backend with FastAPI endpoints
								serving real-time insights.
							</ul>
						</div>
						{/* <div className='space-y-2'>
							<h3 className='font-semibold text-gray-800'>
								How it works:
							</h3>
							<p>
								Select products from the left panel to see
								personalized bundle recommendations. The system
								analyzes product relationships, customer
								behavior, and pricing patterns to suggest the
								most beneficial combinations.
							</p>
						</div> */}
					</div>
				</div>
			</div>
			<div>
				<h2 className='text-xl font-semibold mb-2'>Select Products</h2>
				<div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2'>
					{products.map(product => (
						<div
							key={product.product_id}
							onClick={() => toggleProduct(product.product_id)}
							className={`cursor-pointer p-2 rounded-md border transition-all duration-200 hover:shadow-sm ${
								selectedProducts.includes(product.product_id)
									? 'border-2 border-blue-500 bg-blue-50'
									: 'border-gray-200'
							}`}
						>
							<h3 className='font-medium text-sm text-gray-600 truncate'>
								{product.product_name}
							</h3>
							<p className='text-xs text-gray-500'>
								₹{product.price.toLocaleString()}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default BundleDashboard
