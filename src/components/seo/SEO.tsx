import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  structuredData?: object;
  noindex?: boolean;
}

const defaultMeta = {
  title: 'METRIS - Quantified AI Governance Platform | SANJEEVANI AI',
  description: 'METRIS by SANJEEVANI AI connects risk to ROI at every stage. Scan AI systems, get governance scores, and quantify financial risk exposure.',
  keywords: 'AI governance, AI risk, EU AI Act, compliance, METRIS, SANJEEVANI AI, AI audit, machine learning governance',
  image: 'https://metris.sanjeevani.ai/og-image.png',
  url: 'https://metris.sanjeevani.ai',
};

export const SEO = ({
  title,
  description = defaultMeta.description,
  keywords = defaultMeta.keywords,
  image = defaultMeta.image,
  url = defaultMeta.url,
  type = 'website',
  structuredData,
  noindex = false,
}: SEOProps) => {
  const fullTitle = title 
    ? `${title} | METRIS by SANJEEVANI AI` 
    : defaultMeta.title;

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SANJEEVANI AI',
    url: 'https://metris.sanjeevani.ai',
    logo: 'https://metris.sanjeevani.ai/logo.png',
    description: 'AI Governance and Risk Quantification Platform',
    sameAs: [
      'https://twitter.com/SANJEEVANI_AI',
      'https://linkedin.com/company/SANJEEVANI-AI',
    ],
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'METRIS',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: description,
    creator: organizationSchema,
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="SANJEEVANI AI" />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="METRIS by SANJEEVANI AI" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@SANJEEVANI_AI" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(softwareSchema)}
      </script>
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
