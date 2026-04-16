export const setMetaTags = (title, description, imageUrl = null) => {
  // Set or update title
  document.title = title;

  // Remove existing meta tags
  const existingMetaTags = document.querySelectorAll('meta[data-dynamic="true"]');
  existingMetaTags.forEach(tag => tag.remove());

  // Add new meta tags
  const metaTags = [
    // Open Graph tags
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: window.location.href },
    // Twitter Card tags
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:card', content: 'summary_large_image' },
  ];

  // Add image if provided
  if (imageUrl) {
    metaTags.push({ property: 'og:image', content: imageUrl });
    metaTags.push({ name: 'twitter:image', content: imageUrl });
  }

  // Create and append meta tags
  metaTags.forEach(tagData => {
    const meta = document.createElement('meta');
    meta.setAttribute('data-dynamic', 'true');
    
    if (tagData.property) {
      meta.setAttribute('property', tagData.property);
    } else if (tagData.name) {
      meta.setAttribute('name', tagData.name);
    }
    
    meta.setAttribute('content', tagData.content);
    document.head.appendChild(meta);
  });
};

export const clearMetaTags = () => {
  const existingMetaTags = document.querySelectorAll('meta[data-dynamic="true"]');
  existingMetaTags.forEach(tag => tag.remove());
};
