import type { ServiceId, ServicePageCopy } from "@/lib/content";

export const servicePagesEn = {
  ai: {
    metaTitle: "AI for companies",
    metaDescription:
      "Assistants, internal search, and agents where return is measurable. AI comes in when it produces a concrete result.",
    hero: {
      heading: "Intelligence where the return is measurable.",
      body: "Assistants, documents, internal search, and agents. AI comes in when it saves time, cuts errors, or opens a capability you do not have — not as theatre.",
      primaryCta: "Get a budget range",
    },
    pains: [
      {
        title: "The same questions, over and over",
        body: "Support, operations, or engineering answer the repetitive work by hand. What matters gets mixed with routine.",
      },
      {
        title: "Knowledge leaves with people",
        body: "Procedures, exceptions, and judgment live in heads and chats. When someone leaves, the company loses context.",
      },
      {
        title: "Finding information eats the week",
        body: "Contracts, specs, policies, and email threads sit in five places. Nobody finds the current version on the first try.",
      },
      {
        title: "ChatGPT does not know your processes",
        body: "A generic tool does not know your lead times, your ERP, or your rules. It fills gaps fluently and does not cite a source.",
      },
    ],
    capabilities: [
      {
        title: "Assistants on your knowledge",
        body: "Natural-language questions, answers from internal documentation, and the source in view.",
      },
      {
        title: "Chatbots that escalate what matters",
        body: "The repetitive cases resolve themselves. Sensitive or incomplete ones reach a person, with context.",
      },
      {
        title: "Documents, transcription, and reports",
        body: "From audio, tickets, or folders to useful text. Without replacing the judgment of whoever decides.",
      },
      {
        title: "Agents with one concrete job",
        body: "A bounded flow: classify, extract, draft, or alert. Measurable from day one.",
      },
    ],
    flow: {
      heading: "Hundreds of queries: AI handles the simple ones and escalates the important ones.",
      steps: [
        "We define which questions are worth automating and where the answer lives today.",
        "We index the real sources — documents, ERP, wiki — with the permissions that already exist.",
        "The assistant answers the routine work and leaves a trail to the source.",
        "What does not fit is handed to a person, with the thread already assembled.",
        "We look at volume resolved, time saved, and failures. Then we adjust.",
      ],
    },
    faq: [
      {
        q: "How is this different from ChatGPT or Copilot?",
        a: "Those tools work with generic knowledge. A custom assistant answers from your documentation, your rules, and your sources. If the base is missing, it says so; it does not invent.",
      },
      {
        q: "Do documents need to be perfectly organised first?",
        a: "No. We start from what you have: PDFs, folders, Drive, SharePoint, an ERP. Clearer sources mean better answers. Tidying can be part of the work, not a prerequisite.",
      },
      {
        q: "Where does the data live?",
        a: "In an environment we agree with you. We do not use your information to train general models. Permissions are designed with the same care as the rest of the system.",
      },
      {
        q: "How long until a useful first version?",
        a: "It depends on volume and integrations. A usable first version in a few weeks is typical, with a written business goal — not an endless pilot.",
      },
      {
        q: "Can it be wrong?",
        a: "Yes. That is why relevant answers carry a source, and what is not in the base is not invented. The design assumes verification, not blind faith in the model.",
      },
    ],
    close: {
      heading: "If there is a concrete case, we will look at it.",
      body: "A six-question brief or a meeting. No commitment; scope is confirmed on a call.",
    },
  },
  automation: {
    metaTitle: "Automation and digitalisation",
    metaDescription:
      "Remove manual tasks and connect what currently lives in people: CRM, email, bookings, invoices, and reminders in a flow that moves on its own.",
    hero: {
      heading: "Less copying by hand. More process that runs itself.",
      body: "Bookings, CRM, email, quotes, reminders, and invoicing. Less Excel, loose WhatsApp, and copying between tools.",
      primaryCta: "Get a budget range",
    },
    pains: [
      {
        title: "The same data is typed three times",
        body: "Site, CRM, spreadsheet, and WhatsApp. Every copy is delay and an error nobody sees until it hurts.",
      },
      {
        title: "The process lives in one person",
        body: "If they are away, bookings, follow-ups, or invoices stop. There is no system — there is memory.",
      },
      {
        title: "The tools do not talk",
        body: "Each does its part. You are the bridge, by hand, every day.",
      },
      {
        title: "Nobody measures what is lost",
        body: "Hours of copying, remembering, and chasing. The cost is there, but it never shows up in a report.",
      },
    ],
    capabilities: [
      {
        title: "Capture that lands in the CRM by itself",
        body: "Form, site, or WhatsApp: the lead arrives with context, not as a stray message.",
      },
      {
        title: "Bookings, reminders, and follow-up",
        body: "The calendar, the nudge, and the next step do not depend on someone remembering.",
      },
      {
        title: "Quotes, invoices, and operational email",
        body: "From a process state to a document or a send, without filling the same fields again.",
      },
      {
        title: "Clear rules, not magic",
        body: "If the case is predictable, it is automated. If it needs judgment, it reaches a person.",
      },
    ],
    flow: {
      heading: "Lead on the site → CRM → WhatsApp → booking → reminder → follow-up.",
      steps: [
        "We map the real flow: who does what, with which tool, where it breaks.",
        "We decide what stays, what gets connected, and what stops being done by hand.",
        "We build the bridge: events, fields, and visible exceptions.",
        "We start with one stretch of the process, not the whole company at once.",
        "We measure time, errors, and volume. Further stretches are added with evidence.",
      ],
    },
    faq: [
      {
        q: "Do we have to throw away the tools we already use?",
        a: "Almost never. First we decide whether to integrate, complement, or replace. If the CRM or calendar works, it stays. Automation is not switching software for sport.",
      },
      {
        q: "Is this just Zapier?",
        a: "Sometimes a light connection is enough. Other times the flow needs rules, data, and exceptions that generic glue cannot hold. We see that in the scope, not in a preset recipe.",
      },
      {
        q: "What about exceptions?",
        a: "They are designed in. A process with no exceptions is a slide deck. The ones that matter reach a person, with the context needed to decide.",
      },
      {
        q: "How soon is a result visible?",
        a: "A bounded stretch — lead to booking, for example — can be in production in a few weeks. Wiring the whole operation is another conversation, in phases.",
      },
      {
        q: "Does the team have to change how they work?",
        a: "As little as possible. We prefer to ship where they already work (email, CRM, WhatsApp) rather than invent another platform nobody opens.",
      },
    ],
    close: {
      heading: "If a flow is still copied by hand, we will look at it.",
      body: "A brief or a meeting. Scope, systems, and the first stretch are confirmed in writing.",
    },
  },
  software: {
    metaTitle: "Custom software",
    metaDescription:
      "Web and mobile apps, internal platforms, and SaaS when the problem needs a solution of its own — not another landing page or a rigid licence.",
    hero: {
      heading: "A solution of your own when the problem requires it.",
      body: "Web and mobile apps, portals, management systems, APIs, and data. The technical core: custom software, not a capture site.",
      primaryCta: "Get a budget range",
    },
    pains: [
      {
        title: "You have bent the business to the tool",
        body: "The licence does not cover the process. The team invents Excel workarounds and the house standard is lost.",
      },
      {
        title: "There is a spreadsheet only one person understands",
        body: "The operational core fits in a file. Nobody dares to touch it. That does not scale and cannot be audited.",
      },
      {
        title: "Several systems, no complete flow",
        body: "Each piece does something. End-to-end still lives in the head of whoever coordinates.",
      },
      {
        title: "A product, not another website",
        body: "You need an application, a portal, or a SaaS. A landing page does not solve the problem.",
      },
    ],
    capabilities: [
      {
        title: "Web and mobile applications",
        body: "The main flow, end to end, with real users. Not a prototype that stays in Figma.",
      },
      {
        title: "Internal platforms and portals",
        body: "For the team, for customers, or for partners. Permissions, states, and a definition of done.",
      },
      {
        title: "APIs, backend, and data",
        body: "The product has a stable core. Integrations and screens lean on it, not the other way around.",
      },
      {
        title: "SaaS and management systems",
        body: "When the business is the software. A viable minimum, not an infinite catalogue on day one.",
      },
    ],
    flow: {
      heading: "The technical core: custom software, not a capture site.",
      steps: [
        "We understand the process, the users, and what hurts in the current tools.",
        "We agree the minimum flow that has to work end to end.",
        "We design and build in the open: demos, not a quiet we are on it.",
        "A usable slice goes to production. The rest is prioritised with real use.",
        "We measure the result we wrote down at the start. Then we adjust with data.",
      ],
    },
    faq: [
      {
        q: "How do we know we need custom software?",
        a: "Three signals together: a critical spreadsheet only one person understands, the same data in several programmes, and a process forced by a licence. If that sounds familiar, building is no longer a luxury.",
      },
      {
        q: "MVP or the full product?",
        a: "Almost always a slice that covers the main flow. Part of the original plan changes once real users arrive. Finding that out late costs a redesign; finding it early costs a scope change.",
      },
      {
        q: "Is the code and data ours?",
        a: "Yes. We document so another technical team can maintain it. Staying with us for evolution is a choice, not a lock-in.",
      },
      {
        q: "Do you work in phases?",
        a: "That is the default. Each phase has a deliverable, a price, and an acceptance criterion. You can stop with something running, not a half-built project.",
      },
      {
        q: "How long until a first version in production?",
        a: "A bounded main flow is usually measured in weeks, not a year. The concrete timeline comes from written scope, not a catalogue rate.",
      },
    ],
    close: {
      heading: "If the problem needs a product, not another tool, we will look at it.",
      body: "A brief or a meeting. Scope, timeline, and a written measure of success.",
    },
  },
  web: {
    metaTitle: "Web development and digital presence",
    metaDescription:
      "Clear corporate sites, landings, and ecommerce, ready to capture. A more direct need than a custom product.",
    hero: {
      heading: "Clear digital presence, ready to capture.",
      body: "Sites, landings, catalogues, bookings, and maintenance. A business almost invisible online: a site, capture, and the channel where people already write to you.",
      primaryCta: "Get a budget range",
    },
    pains: [
      {
        title: "The site does not explain what you do",
        body: "Visitors cannot tell if you are for them, what to ask, or what happens next. They leave.",
      },
      {
        title: "You capture late, or not at all",
        body: "There is no clear path to a meeting, WhatsApp, or a form. Traffic does not convert.",
      },
      {
        title: "It is slow, stale, or locked to a builder",
        body: "Every change is a chore. The layout does not hold on a phone. Basic technical SEO is missing.",
      },
      {
        title: "You do not need a custom product",
        body: "You need presence that works: clear, fast, and connected to the commercial channel.",
      },
    ],
    capabilities: [
      {
        title: "Corporate sites and landings",
        body: "Message, structure, and a concrete destination: brief, calendar, or contact. No filler pages.",
      },
      {
        title: "Catalogues, bookings, and ecommerce",
        body: "When you need to show, book, or sell. Wired to what you already use to charge or serve.",
      },
      {
        title: "Redesign and basic technical SEO",
        body: "Performance, indexing, analytics, and a base you can maintain.",
      },
      {
        title: "Maintenance",
        body: "The site is not abandoned on launch day. Changes, security, and whatever stops converting.",
      },
    ],
    flow: {
      heading: "A business almost invisible online: site, capture, and WhatsApp.",
      steps: [
        "We clarify offer, audience, and the action that matters (meeting, message, purchase).",
        "Structure, copy, and design serve that action — not a portfolio piece.",
        "We build fast, measurable, and ready for the channel you already use.",
        "We ship with analytics and a conversion criterion in view.",
        "We adjust titles, paths, and calls based on what people do, not taste.",
      ],
    },
    faq: [
      {
        q: "A website or custom software?",
        a: "If the problem is capturing, explaining, and starting a conversation, a well-made site is enough. If the problem is an internal process or a product, that is another line. We separate them at the start.",
      },
      {
        q: "Do you build ecommerce?",
        a: "Catalogues, checkout, and what it takes to sell for real, without a monster on day one. If the core is stock, ERP, or odd rules, integrations or software come in too.",
      },
      {
        q: "Does this include SEO?",
        a: "Basic technical SEO: speed, structure, indexing, analytics. Ad campaigns and a blog are not the core of this service unless we agree them.",
      },
      {
        q: "Can we edit afterwards?",
        a: "Yes, with a clear line between content and design. We do not leave you locked to a builder you do not control.",
      },
      {
        q: "Languages?",
        a: "The site already works in Spanish, English, and Polish when needed. The scope of each language is defined in the brief.",
      },
    ],
    close: {
      heading: "If the site does not capture, we change its job.",
      body: "A brief or a meeting. A written capture goal, not a pretty, silent homepage.",
    },
  },
  integrations: {
    metaTitle: "Integrations and business systems",
    metaDescription:
      "Connect CRM, ERP, payments, and what you already use. First we decide whether to integrate, complement, or replace — we do not throw away what works.",
    hero: {
      heading: "Your tools, connected. Without replacing what works.",
      body: "APIs, CRM, ERP, Stripe, WhatsApp, Google Workspace, Microsoft, and legacy systems. Current software stays; data and flows stop living in isolation.",
      primaryCta: "Get a budget range",
    },
    pains: [
      {
        title: "Each system is an island",
        body: "Orders, invoices, customers, and stock do not agree. The bridge is a person with two screens.",
      },
      {
        title: "The data is never the same anywhere",
        body: "The CRM says one thing, the ERP another. Nobody knows which is current until a customer asks.",
      },
      {
        title: "You paid for a replacement that does not fit",
        body: "Replacing everything is slow and expensive. Often a well-made bridge is enough.",
      },
      {
        title: "Legacy cannot be touched, but it must be used",
        body: "Invoicing, warehouse, or a fifteen-year-old programme. We have to talk to it, not pretend it is gone.",
      },
    ],
    capabilities: [
      {
        title: "APIs and sync",
        body: "Events, queues, and a rule for which record wins when data conflicts.",
      },
      {
        title: "CRM, ERP, and payments",
        body: "HubSpot, ERPs, Stripe, and whatever already moves money or customers. Connect, do not duplicate.",
      },
      {
        title: "WhatsApp, email, and Workspace",
        body: "The channel where the team or the customer already is, hooked to the system of record.",
      },
      {
        title: "Legacy, treated with respect",
        body: "Read, bounded write, or a layer in front. First we decide; then we build.",
      },
    ],
    flow: {
      heading: "Current software stays; data and flows stop living in isolation.",
      steps: [
        "We inventory systems, data owners, and the flow that is still done by hand.",
        "We decide to integrate, complement, or replace — in writing, not on the fly.",
        "We design the contract: fields, errors, retries, and who sees a failure.",
        "We connect one real stretch (for example, order → invoice) and put it under test.",
        "We measure mismatches and time saved. The next bridge is justified with that.",
      ],
    },
    faq: [
      {
        q: "Integrate or replace?",
        a: "We decide first. If what you have covers the process and the pain is the bridge, we integrate. If the tool forces the business, we consider complementing or replacing. We do not throw away what works by default.",
      },
      {
        q: "Which systems do you work with?",
        a: "Anything with an API or a reasonable path: CRM, ERP, Stripe, WhatsApp, Google, Microsoft, databases. If it is not documented, we build the connector. There is no closed list.",
      },
      {
        q: "What if a system fails in the middle of the night?",
        a: "Retries, a log, and an alert to whoever operates it. An integration without observability is another invisible spreadsheet.",
      },
      {
        q: "How long until a useful first bridge?",
        a: "A bounded stretch — one business object, two systems — can be weeks. The whole-company map is a programme, not a ticket.",
      },
      {
        q: "Are we locked in with you?",
        a: "No. We document contracts, errors, and operations. Keeping us on maintenance is optional.",
      },
    ],
    close: {
      heading: "If you are the bridge, we turn it into a system.",
      body: "A brief or a meeting. What connects, what stays, and how a failure is seen — in writing.",
    },
  },
} satisfies Record<ServiceId, ServicePageCopy>;
