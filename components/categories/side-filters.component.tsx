import { useMemo, useState } from "react";
import { Star, ChevronDown, X } from "lucide-react";
import clsx from "clsx";

const brands = ["Apple", "Samsung", "Nike", "Adidas", "Sony"];

const ratings = [4, 3, 2, 1];

export default function SideFilter() {
  const [price, setPrice] = useState([5000, 30000]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [inStockOnly, setInStockOnly] = useState(false);

  const activeFilters = useMemo(() => {
    return (
      selectedCategory.length +
      selectedBrands.length +
      (selectedRating ? 1 : 0) +
      (inStockOnly ? 1 : 0)
    );
  }, [selectedCategory, selectedBrands, selectedRating, inStockOnly]);

  const toggleValue = (value, state, setter) => {
    setter(
      state.includes(value)
        ? state.filter((v) => v !== value)
        : [...state, value],
    );
  };

  const clearFilters = () => {
    setSelectedCategory([]);
    setSelectedBrands([]);
    setSelectedRating(null);
    setInStockOnly(false);
    setPrice([5000, 30000]);
  };

  return (
    <aside className="sticky w-72 self-start rounded-xl border border-gray-300 bg-white p-5">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        {activeFilters > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm font-medium text-red-500 hover:text-red-600"
          >
            Reset
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Categories */}
        <section>
          <button className="mb-4 flex w-full items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Categories</h3>

            <ChevronDown className="size-4 text-gray-500" />
          </button>
        </section>

        {/* Brands */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Brands</h3>

            <ChevronDown className="size-4 text-gray-500" />
          </div>

          <div className="flex flex-wrap gap-2">
            {brands.map((brand) => {
              const active = selectedBrands.includes(brand);

              return (
                <button
                  key={brand}
                  onClick={() =>
                    toggleValue(brand, selectedBrands, setSelectedBrands)
                  }
                  className={clsx(
                    "rounded-full border px-3 py-1.5 text-sm transition-all",
                    active
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                >
                  {brand}
                </button>
              );
            })}
          </div>
        </section>

        {/* Availability */}
        <section>
          <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-3">
            <div>
              <p className="text-sm font-medium text-gray-900">In Stock Only</p>

              <p className="text-xs text-gray-500">Show available products</p>
            </div>

            <button
              onClick={() => setInStockOnly((prev) => !prev)}
              className={clsx(
                "relative h-6 w-11 rounded-full transition-all",
                inStockOnly ? "bg-black" : "bg-gray-300",
              )}
            >
              <div
                className={clsx(
                  "absolute top-1 size-4 rounded-full bg-white transition-all",
                  inStockOnly ? "left-6" : "left-1",
                )}
              />
            </button>
          </div>
        </section>
      </div>
    </aside>
  );
}
