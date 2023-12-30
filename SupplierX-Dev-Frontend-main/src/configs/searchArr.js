const searchData = [
  {
    groupTitle: 'Master Data',
    searchLimit: 4,
    data: [
      {
        id: 1,
        target: 'business-group',
        isBookmarked: false,
        title: 'business group',
        icon: 'Home',
        link: '/configuration/business-group'
      },
      {
        id: 2,
        target: 'payment',
        isBookmarked: false,
        title: 'payment',
        icon: 'Home',
        link: '/configuration/payment'
      },
      {
        id: 3,
        target: 'business-type',
        isBookmarked: false,
        title: 'business type',
        icon: 'Home',
        link: '/configuration/business-type'
      },
      {
        id: 4,
        target: 'company-type',
        isBookmarked: false,
        title: 'company type',
        icon: 'Home',
        link: '/configuration/company-type'
      },

    ]
  },
  {
    groupTitle: 'Common',
    searchLimit: 4,
    data: [
      {
        id: 1,
        target: 'countries',
        isBookmarked: false,
        title: 'countries',
        icon: 'Home',
        link: '/settings/countries'
      },
      {
        id: 2,
        target: 'payment',
        isBookmarked: false,
        title: 'payment',
        icon: 'Home',
        link: 'common/currency'
      },

    ]
  }
]


export default searchData