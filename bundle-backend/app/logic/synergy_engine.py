#phase 4 - v2

import pandas as pd
import numpy as np
from itertools import combinations

# ---------- Helper Functions ----------

def get_top_synergy_products(cart, synergy_df, top_n=10):
    """Returns top_n products with highest synergy score with items in cart"""
    synergy_scores = synergy_df[synergy_df['product_a'].isin(cart)]
    synergy_scores = synergy_scores.groupby('product_b', as_index=False)['synergy_score'].mean()
    synergy_scores = synergy_scores[~synergy_scores['product_b'].isin(cart)]  # exclude already in cart
    synergy_scores = synergy_scores.sort_values(by='synergy_score', ascending=False)
    return synergy_scores.head(top_n)

def estimate_acceptance_probability(bundle_synergy):
    """Estimate acceptance probability using a sigmoid approximation."""
    # Bundle synergy is average synergy score of all products in the bundle
    return 1 / (1 + np.exp(-10 * (bundle_synergy - 0.1)))  # shift/scale sigmoid for reasonable shape

def recommend_discount(cart_value, bundle_value, synergy_score):
    """Return a discount % based on synergy_score and total value."""
    base_discount = 0.05  # 5% base
    synergy_bonus = min(0.15, synergy_score)  # cap synergy-based discount
    discount_rate = base_discount + synergy_bonus
    discount_value = bundle_value * discount_rate
    return discount_rate, discount_value

# ---------- Evaluation Function ----------

def evaluate_bundles_by_size(cart, synergy_df, products_df, max_bundle_size=3):
    top_products_df = get_top_synergy_products(cart, synergy_df, top_n=10)
    best_result = None
    all_evaluations = []

    for size in range(1, max_bundle_size + 1):
        bundle_combos = list(combinations(top_products_df['product_b'], size))

        for bundle in bundle_combos:
            bundle = list(bundle)
            bundle_synergy = top_products_df[top_products_df['product_b'].isin(bundle)]['synergy_score'].mean()
            acceptance_prob = estimate_acceptance_probability(bundle_synergy)

            bundle_price = products_df[products_df['product_id'].isin(bundle)]['price'].sum()
            cart_price = products_df[products_df['product_id'].isin(cart)]['price'].sum()
            maximum_expected_cart_price = cart_price*(1.8)

            discount_rate, discount_value = recommend_discount(cart_price, bundle_price, bundle_synergy)
            expected_order_value = (cart_price)+ (bundle_price - discount_value) * acceptance_prob
            print(acceptance_prob)
            
             # AOV Uplift
            aov_uplift = (((expected_order_value - cart_price)/cart_price)) if cart_price else 0
            aov_uplift*=100

            if expected_order_value>maximum_expected_cart_price:
              continue
            result = {
                'bundle': bundle,
                'size': size,
                'synergy': bundle_synergy,
                'acceptance_prob': acceptance_prob,
                'discount_rate': discount_rate,
                'expected_order_value': expected_order_value,
                'aov_uplift': aov_uplift
            }
            all_evaluations.append(result)

            if best_result is None or expected_order_value > best_result['acceptance_prob']:
                best_result = result

    return best_result, all_evaluations


def recommend_bundle(cart, synergy_df, products_df):
    best_bundle, all_evals = evaluate_bundles_by_size(
        cart=cart,
        synergy_df=synergy_df,
        products_df=products_df
    )
    
    if not best_bundle:
        return {
            "message": "No suitable bundle recommendation found within AOV limits.",
            "bundle": None
        }

    # Fetch product names and prices
    product_lookup = products_df.set_index('product_id')[['product_name', 'price']].to_dict('index')
    bundle_info = [
        {
            "product_id": pid,
            "product_name": product_lookup[pid]['product_name'],
            "price": product_lookup[pid]['price']
        }
        for pid in best_bundle['bundle']
    ]

    
    
    # Calculate bundle price and discounted price
    bundle_price = sum(p["price"] for p in bundle_info)
    discount_rate = best_bundle["discount_rate"]
    discounted_price = bundle_price * (1 - discount_rate)

    response = {
        "recommended_bundle": {
            "products": bundle_info,
            "total_bundle_price": round(bundle_price, 2),
            "discount_rate": round(discount_rate, 2),
            "discounted_price": round(discounted_price, 2),
            "synergy_score": round(best_bundle["synergy"], 3),
            "acceptance_probability": round(best_bundle["acceptance_prob"], 3),
            "expected_value": round(best_bundle["expected_order_value"], 2),
            "aov_uplift": round(best_bundle["aov_uplift"],2)
        },
        "cart_value": round(products_df[products_df['product_id'].isin(cart)]['price'].sum(), 2)
    }

    return response
