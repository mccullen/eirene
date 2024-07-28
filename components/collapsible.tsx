import { useState } from 'react';

const Collapsible = ({ items }) => {
  const [itemOpen, setItemOpen] = useState(items.map(i => i.open));

  const handleToggle = (index) => {
    const newItemOpen = [...itemOpen];
    newItemOpen[index] = !itemOpen[index];
    setItemOpen(newItemOpen);
  };

  return (
    <div className="collapsible">
      {items.map((item, index) => (
        <div key={index} className="">
          <div
            className="flex items-start p-1 cursor-pointer space-x-1"
            onClick={() => handleToggle(index)}
          >
            <div className={`transition-transform duration-300 ${itemOpen[index] ? 'rotate-90' : ''}`}>
              &gt;
            </div>
            <div className="text-lg font-semibold">{item.title}</div>
          </div>
          {itemOpen[index] && (
            <div className="p-1 ml-2">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Collapsible;