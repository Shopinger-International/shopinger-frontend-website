import { useState } from "react";

// icons
import { SlidersHorizontal } from "lucide-react";

// local components
import FilterSelector from "@/components/categories/filter-selector.component";

const initial_filters = [
  {
    attribute: {
      name: "Ram",
      code: "ram",
      is_open: false,
    },
    options: [
      { label: "2GB", value: "2gb", is_enabled: true },
      { label: "4GB", value: "4gb", is_enabled: true },
      { label: "6GB", value: "6gb", is_enabled: true },
      { label: "8GB", value: "8gb", is_enabled: true },
      { label: "12GB", value: "12gb", is_enabled: true },
      { label: "16GB", value: "16gb", is_enabled: true },
      { label: "32GB", value: "32gb", is_enabled: false },
      { label: "64GB", value: "64gb", is_enabled: false },
    ],
  },

  {
    attribute: {
      name: "Storage",
      code: "storage",
      is_open: false,
    },
    options: [
      { label: "32GB", value: "32gb", is_enabled: true },
      { label: "64GB", value: "64gb", is_enabled: true },
      { label: "128GB", value: "128gb", is_enabled: true },
      { label: "256GB", value: "256gb", is_enabled: true },
      { label: "512GB", value: "512gb", is_enabled: true },
      { label: "1TB", value: "1tb", is_enabled: false },
    ],
  },

  {
    attribute: {
      name: "Brand",
      code: "brand",
      is_open: true,
    },
    options: [
      { label: "Apple", value: "apple", is_enabled: true },
      { label: "Samsung", value: "samsung", is_enabled: true },
      { label: "OnePlus", value: "oneplus", is_enabled: true },
      { label: "Xiaomi", value: "xiaomi", is_enabled: true },
      { label: "Realme", value: "realme", is_enabled: true },
      { label: "Google", value: "google", is_enabled: false },
      { label: "Motorola", value: "motorola", is_enabled: true },
      { label: "Vivo", value: "vivo", is_enabled: true },
      { label: "Oppo", value: "oppo", is_enabled: true },
    ],
  },

  {
    attribute: {
      name: "Battery",
      code: "battery",
      is_open: false,
    },
    options: [
      { label: "3000mAh", value: "3000mah", is_enabled: false },
      { label: "4000mAh", value: "4000mah", is_enabled: true },
      { label: "4500mAh", value: "4500mah", is_enabled: true },
      { label: "5000mAh", value: "5000mah", is_enabled: true },
      { label: "6000mAh", value: "6000mah", is_enabled: true },
      { label: "7000mAh", value: "7000mah", is_enabled: false },
    ],
  },

  {
    attribute: {
      name: "Display Size",
      code: "display_size",
      is_open: false,
    },
    options: [
      { label: "5.5 inch", value: "5_5_inch", is_enabled: false },
      { label: "6.1 inch", value: "6_1_inch", is_enabled: true },
      { label: "6.5 inch", value: "6_5_inch", is_enabled: true },
      { label: "6.7 inch", value: "6_7_inch", is_enabled: true },
      { label: "7+ inch", value: "7_plus_inch", is_enabled: false },
    ],
  },

  {
    attribute: {
      name: "Refresh Rate",
      code: "refresh_rate",
      is_open: false,
    },
    options: [
      { label: "60Hz", value: "60hz", is_enabled: true },
      { label: "90Hz", value: "90hz", is_enabled: true },
      { label: "120Hz", value: "120hz", is_enabled: true },
      { label: "144Hz", value: "144hz", is_enabled: false },
    ],
  },

  {
    attribute: {
      name: "Camera",
      code: "camera",
      is_open: false,
    },
    options: [
      { label: "12MP", value: "12mp", is_enabled: false },
      { label: "48MP", value: "48mp", is_enabled: true },
      { label: "50MP", value: "50mp", is_enabled: true },
      { label: "64MP", value: "64mp", is_enabled: true },
      { label: "108MP", value: "108mp", is_enabled: true },
      { label: "200MP", value: "200mp", is_enabled: false },
    ],
  },

  {
    attribute: {
      name: "Network",
      code: "network",
      is_open: false,
    },
    options: [
      { label: "4G", value: "4g", is_enabled: true },
      { label: "5G", value: "5g", is_enabled: true },
    ],
  },

  {
    attribute: {
      name: "Operating System",
      code: "os",
      is_open: false,
    },
    options: [
      { label: "Android", value: "android", is_enabled: true },
      { label: "iOS", value: "ios", is_enabled: true },
    ],
  },

  {
    attribute: {
      name: "SIM Type",
      code: "sim_type",
      is_open: false,
    },
    options: [
      { label: "Single SIM", value: "single_sim", is_enabled: false },
      { label: "Dual SIM", value: "dual_sim", is_enabled: true },
      { label: "eSIM", value: "esim", is_enabled: true },
    ],
  },

  {
    attribute: {
      name: "Color",
      code: "color",
      is_open: true,
    },
    options: [
      { label: "Black", value: "black", is_enabled: true },
      { label: "White", value: "white", is_enabled: true },
      { label: "Blue", value: "blue", is_enabled: true },
      { label: "Green", value: "green", is_enabled: true },
      { label: "Red", value: "red", is_enabled: false },
      { label: "Gold", value: "gold", is_enabled: false },
      { label: "Silver", value: "silver", is_enabled: true },
      { label: "Purple", value: "purple", is_enabled: true },
    ],
  },

  {
    attribute: {
      name: "Features",
      code: "features",
      is_open: true,
    },
    options: [
      {
        label: "Fast Charging",
        value: "fast_charging",
        is_enabled: true,
      },
      {
        label: "Wireless Charging",
        value: "wireless_charging",
        is_enabled: true,
      },
      {
        label: "Water Resistant",
        value: "water_resistant",
        is_enabled: true,
      },
      {
        label: "Fingerprint Sensor",
        value: "fingerprint_sensor",
        is_enabled: true,
      },
      {
        label: "Face Unlock",
        value: "face_unlock",
        is_enabled: true,
      },
      {
        label: "NFC",
        value: "nfc",
        is_enabled: false,
      },
    ],
  },
];

export default function SideFilters() {
  const [filters, setFilters] = useState(initial_filters);
  return (
    <aside className="min-h-screen w-70 rounded-xl border border-gray-300 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-300 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-gray-300 bg-orange-500 p-2 text-white">
            <SlidersHorizontal className="size-4" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-orange-500">Filters</h2>

            <p className="text-xs text-gray-600">Refine your results</p>
          </div>
        </div>
        <button
          onClick={() => setSelectedCategories([])}
          className="text-xs font-medium text-gray-600 hover:text-gray-900"
        >
          Clear All
        </button>
      </div>

      <div className="p-4 py-5">
        {/* Selected */}
        {/* <div className="flex flex-wrap gap-1 pb-4">
          {selectedCategories.map((category) => {
            const item = categoryOptions.find((c) => c.label === category);

            const Icon = item.icon;

            return (
              <button
                key={category}
                className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-0.5 text-[11px] font-medium text-gray-700 transition hover:border-gray-300"
              >
                {category}
                <X className="size-3 text-gray-600" />
              </button>
            );
          })}
        </div> */}

        <div className="space-y-4">
          {filters.map(({ attribute, options }) => (
            <FilterSelector
              key={`filer-selector-${attribute.code}`}
              label={attribute.name}
              code={attribute.code}
              options={options}
              is_open={attribute.is_open}
              handleOpen={(attribute_code) => {
                setFilters((prev) => {
                  return prev.map((filter) => {
                    const { code, is_open } = filter.attribute;
                    if (code == attribute_code) {
                      return {
                        ...filter,
                        attribute: {
                          ...filter.attribute,
                          is_open: !is_open,
                        },
                      };
                    }
                    return filter;
                  });
                });
              }}
              handleOptionChange={(
                attribute_code: string,
                option_value: string,
                is_enabled: boolean,
              ) =>
                setFilters((prev) =>
                  prev.map((filter) => {
                    const { attribute, options } = filter;
                    const { code } = attribute;
                    if (code == attribute_code) {
                      return {
                        ...filter,
                        options: options.map((option) =>
                          option.value == option_value
                            ? {
                                ...option,
                                is_enabled,
                              }
                            : option,
                        ),
                      };
                    }
                    return filter;
                  }),
                )
              }
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
