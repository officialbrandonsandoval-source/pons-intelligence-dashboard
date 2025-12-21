import '../styles/components/DealTable.css';

function DealTable() {
  const deals = [
    {
      id: 1,
      company: 'Acme Corp',
      value: 125000,
      stage: 'Proposal',
      health: 'Medium',
      lastContact: '14 days ago'
    },
    {
      id: 2,
      company: 'TechStart Inc',
      value: 85000,
      stage: 'Negotiation',
      health: 'High',
      lastContact: '2 days ago'
    },
    {
      id: 3,
      company: 'Global Systems',
      value: 210000,
      stage: 'Discovery',
      health: 'Low',
      lastContact: '21 days ago'
    },
    {
      id: 4,
      company: 'InnovateCo',
      value: 45000,
      stage: 'Proposal',
      health: 'High',
      lastContact: '1 day ago'
    },
    {
      id: 5,
      company: 'Enterprise Solutions',
      value: 175000,
      stage: 'Negotiation',
      health: 'Medium',
      lastContact: '7 days ago'
    }
  ];

  const getHealthClass = (health) => {
    return `health-badge ${health.toLowerCase()}`;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="deal-table-container">
      <table className="deal-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Value</th>
            <th>Stage</th>
            <th>Health</th>
            <th>Last Contact</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {deals.map((deal) => (
            <tr key={deal.id}>
              <td className="company-cell">{deal.company}</td>
              <td className="value-cell">{formatCurrency(deal.value)}</td>
              <td>{deal.stage}</td>
              <td>
                <span className={getHealthClass(deal.health)}>
                  {deal.health}
                </span>
              </td>
              <td className="contact-cell">{deal.lastContact}</td>
              <td>
                <button className="btn-table-action">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DealTable;
