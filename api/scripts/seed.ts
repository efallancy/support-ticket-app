import { prisma } from '../src/client/prisma.js';
import { PriorityEnum, StatusEnum } from '../src/generated/prisma/index.js';

async function seed() {
  console.log('🧹 Truncating support tickets table...');
  await prisma.supportTicket.deleteMany({});

  console.log('🌱 Generating 50 support tickets...');

  // Sample categories to create more variety
  const categories = [
    'Account',
    'Billing',
    'Technical',
    'Product',
    'Shipping',
    'Feature',
  ];

  // Detailed templates for realistic data with longer descriptions
  const ticketTemplates = [
    {
      category: 'Account',
      templates: [
        {
          title: 'Login Issue',
          description:
            'Unable to log in with correct credentials. The system shows invalid password error even after resetting my password multiple times. I have tried both the mobile app and website.',
        },
        {
          title: 'Account Locked',
          description:
            'My account was locked after several login attempts. I received no warning and now I cannot access any of my order history or saved information. Please help me regain access.',
        },
        {
          title: 'Email Change Request',
          description:
            'I need to update my email address on file from my old workplace email to my personal one. Please advise on the verification process needed for this change.',
        },
      ],
    },
    {
      category: 'Billing',
      templates: [
        {
          title: 'Double Charge',
          description:
            'I was charged twice for my monthly subscription on May 15th. The transaction IDs are #TX-58291 and #TX-58292. Please refund the duplicate charge of $29.99.',
        },
        {
          title: 'Cancel Subscription',
          description:
            'I would like to cancel my premium subscription effective immediately. I have already tried using the cancellation option in my account settings but kept receiving an error.',
        },
        {
          title: 'Payment Method Update',
          description:
            'Need assistance updating my payment method. The system won\'t accept my new credit card details and shows a vague "Processing Error" message each time I try to save.',
        },
      ],
    },
    {
      category: 'Technical',
      templates: [
        {
          title: 'App Crashes on Launch',
          description:
            "The mobile app crashes immediately upon opening. I'm using the latest version (3.5.2) on Samsung Galaxy S22 with Android 13. I've already tried reinstalling the app twice.",
        },
        {
          title: 'Website Not Loading',
          description:
            'The dashboard page shows a blank screen with no error message. This happens on both Chrome and Firefox browsers. Other pages on the website seem to work fine.',
        },
        {
          title: 'API Integration Error',
          description:
            "We're receiving consistent 403 Forbidden responses when using the documented API endpoint for order creation. Our API key was verified and has the proper permissions enabled.",
        },
      ],
    },
    {
      category: 'Product',
      templates: [
        {
          title: 'Damaged Product Received',
          description:
            'The package arrived with visible external damage. Upon opening, I found the product inside was cracked along the main panel. Order #ORD-89274. Requesting replacement or refund.',
        },
        {
          title: 'Product Missing Components',
          description:
            'The premium toolkit I ordered was missing the 10mm hex attachment and the user manual. Everything else was included in the package. Order placed on June 3rd, #ORD-90183.',
        },
        {
          title: 'Wrong Item Shipped',
          description:
            'I ordered the deluxe version but received the standard model instead. The price difference is $45. Order confirmation clearly shows I paid for the deluxe version. Order #ORD-92371.',
        },
      ],
    },
    {
      category: 'Shipping',
      templates: [
        {
          title: 'Package Delayed',
          description:
            'My order has been stuck in "In Transit" status for 8 days now. The estimated delivery was supposed to be 3 days ago. Tracking number is TRK-28501-XY and order is #ORD-95184.',
        },
        {
          title: 'Wrong Shipping Address',
          description:
            "I need to change the shipping address for my recent order #ORD-97253. I accidentally selected my old address during checkout. The package hasn't shipped yet according to my order status.",
        },
        {
          title: 'Missing Tracking Information',
          description:
            'My order status changed to "Shipped" two days ago, but I still haven\'t received any tracking information via email or in my account. Order #ORD-96432 placed on June 8th.',
        },
      ],
    },
    {
      category: 'Feature',
      templates: [
        {
          title: 'Dark Mode Request',
          description:
            'Would like to request a dark mode option for both the website and mobile app. This would greatly improve usability at night and reduce eye strain for those of us who use the platform frequently.',
        },
        {
          title: 'Bulk Export Feature',
          description:
            'Our team needs the ability to export transaction history in bulk for accounting purposes. Currently we can only export one month at a time which is very time-consuming for year-end reporting.',
        },
        {
          title: 'Saved Templates Function',
          description:
            'It would be helpful to have a feature that allows saving message templates for repeated communications. This would save our team significant time when sending similar responses to clients.',
        },
      ],
    },
  ];

  const tickets = [];

  // Helper function to get a random element from an array
  const getRandomElement = <T>(arr: T[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  // Helper function to get a random date within past 90 days
  const getRandomDate = (daysBack = 90) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
    // Add some randomness to the time component
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    return date;
  };

  // Create 50 tickets with varied categories, statuses, and priorities
  for (let i = 0; i < 50; i++) {
    // Select a random category
    const category = getRandomElement(categories);
    // Find the template group for this category
    const categoryTemplates = ticketTemplates.find(
      (t) => t.category === category
    );
    // Select a random template from this category
    const template = getRandomElement(categoryTemplates!.templates);

    // Create a more natural distribution of statuses and priorities
    let status: StatusEnum, priority: PriorityEnum;

    // More realistic distribution of statuses
    const statusRandom = Math.random();
    if (statusRandom < 0.4) {
      status = 'OPEN'; // 40% open tickets
    } else if (statusRandom < 0.7) {
      status = 'IN_PROGRESS'; // 30% in progress
    } else if (statusRandom < 0.9) {
      status = 'RESOLVED'; // 20% resolved
    } else {
      status = 'CLOSED'; // 10% closed
    }

    // More realistic distribution of priorities
    const priorityRandom = Math.random();
    if (priorityRandom < 0.25) {
      priority = 'HIGH'; // 25% high priority
    } else if (priorityRandom < 0.65) {
      priority = 'MEDIUM'; // 40% medium priority
    } else {
      priority = 'LOW'; // 35% low priority
    }

    // For a more realistic scenario, high priority tickets are more likely to be open or in progress
    if (priority === 'HIGH' && status === 'CLOSED' && Math.random() < 0.7) {
      status = 'OPEN';
    }

    // Create dates with more realistic patterns
    const createdAt = getRandomDate();

    // Add a ticket number for more realism
    const ticketNumber = 100000 + i;

    tickets.push({
      title: `[${category}] ${template.title} #${ticketNumber}`,
      description: template.description,
      status,
      priority,
      createdAt,
    });
  }

  // Insert all tickets in a batch operation
  await prisma.supportTicket.createMany({
    data: tickets,
  });

  console.log(`✅ Successfully created ${tickets.length} support tickets!`);
}

async function main() {
  try {
    console.log('🚀 Starting seed process...');
    await seed();
    console.log('🎉 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
