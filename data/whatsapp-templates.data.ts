const cleanTemplate = (text: string) => {
  return text
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
};

export const whatsapp_templates = {
  emi: cleanTemplate(`
    Hi Shopinger,
    I want to purchase a product on No-Cost EMI.

    Product Name: 
    Approx. Budget: 
    Delivery Location:

    *Note: Please fill in the above details and send this message to us.*
    `),
  doctor_consultation: cleanTemplate(`
    Hi Shopinger,
    I want to book an online doctor consultation.

    Patient Name:
    Department:
    Health Problem:
    Preferred Date/Time:

    *Note: Please fill in the above details and send this message to us.*
    `),
  pathology_test: cleanTemplate(`
    Hi Shopinger,
    I want to book a pathology test.

    Patient Name:
    Test Name:
    Preferred Date/Time:
    Location:

    *Note: Please fill in the above details and send this message to us.*
    `),
  health_insurance_package: cleanTemplate(`
    Hi Shopinger,
    I want to purchase a health insurance package.

    Name:
    Age:
    Approx. Budget:
    Location:

    *Note: Please fill in the above details and send this message to us.*
    `),
  order_medicines: cleanTemplate(`
    Hi Shopinger,
    I want to order medicines.

    Prescription attached.
    Please proceed.

    *Note: Please fill in the above details and send this message to us.*
    `),
};
