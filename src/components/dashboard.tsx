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

	useEffect(() => {
		axios
			.get<Product[]>('http://localhost:8000/api/products')
			.then(res => {
				setProducts(res.data)
				console.log(res.data)
			})
			.catch(err => console.error('Error loading products:', err))
	}, [])

	useEffect(() => {
		if (selectedProducts.length > 0) {
			axios
				.post<BundleRecommendation>(
					'http://localhost:8000/api/recommend_bundle',
					{
						cart: selectedProducts,
					}
				)
				.then(res => setRecommendation(res.data))
				.catch(err =>
					console.error('Error fetching recommendation:', err)
				)
		} else {
			setRecommendation(null)
		}
	}, [selectedProducts])

	const toggleProduct = (id: string): void => {
		setSelectedProducts(prev =>
			prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
		)
	}

	return (
		<div className='p-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
			<div>
				<h2 className='text-xl font-semibold mb-2'>Select Products</h2>
				<div className='grid grid-cols-2 md:grid-cols-5 gap-5'>
					{products.map(product => (
						<div
							key={product.product_id}
							onClick={() => toggleProduct(product.product_id)}
							className={`cursor-pointer p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
								selectedProducts.includes(product.product_id)
									? 'border-2 border-blue-500 bg-blue-50'
									: 'border-gray-200'
							}`}
						>
							<h3 className='font-medium text-gray-500 mb-2'>
								{product.product_name}
							</h3>
							<p className='text-sm text-gray-500'>
								₹{product.price.toLocaleString()}
							</p>
						</div>
					))}
				</div>
			</div>

			<div>
				<h2 className='text-xl font-semibold mb-2'>
					Bundle Recommendation
				</h2>
				{recommendation && recommendation.recommended_bundle ? (
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
									Discounte Percentage Offered:
								</span>
								<span className='text-blue-600 font-medium'>
									₹
									{recommendation.recommended_bundle.discount_rate.toLocaleString()}
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
									AOV Uplift:
								</span>
								<span className='text-purple-600 font-medium'>
									₹
									{recommendation.recommended_bundle.aov_uplift.toLocaleString()}
								</span>
							</p>
						</div>
					</div>
				) : (
					<div className='bg-gray-50 p-6 rounded-lg text-center'>
						<p className='text-gray-500'>
							Select products to see recommendation.
						</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default BundleDashboard
