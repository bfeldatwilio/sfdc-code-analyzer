import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [fileName, setFileName] = useState("Choose a File");

  useEffect(() => {
    if(categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  }, [categories]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function() {
      const contents = JSON.parse(reader.result);
      setFileName(contents[0].fileName.split('/').pop());
      setCategories(createCategories(contents[0].violations));
    };

  
    reader.onerror = function() {
      console.log(reader.error);
    };

    const createCategories = (violations) => {
      let categories = violations.map(violation => violation.category);
      let categorySet = new Set(categories);
      let categoryData = [];
      categorySet.forEach(category => {
        const categoryViolations = violations.filter(violation => violation.category === category);
        categoryData.push({name: category, count: categoryViolations.length, violations: categoryViolations, expanded: false});
      });
      console.log(categoryData);
      return categoryData;
    }
  }
  return (
    <div className="App">
      <section className="header">
        <input accept="json" type="file" onChange={handleFileChange} />
        <div>
          {fileName !== "Choose a File" && 
            <span>Violations for {fileName}</span> 
        }
        </div>
      </section>
      <section className="categories">
        {categories.map((category, index) => {
            return ( 
              activeCategory && 
              <div onClick={() => setActiveCategory(category)} key={index} className={activeCategory.name === category.name? 'active':''}>
                {category.name} ({category.count})
            </div>)
        })}
      </section>
      <section className="resultTable">
        {activeCategory &&
            <table>
            <thead>
                <tr>
                    <th>Severity</th>
                    <th>Rule: Message</th>
                    <th>Code Lines</th>
                    <th>Violation Info</th>
                </tr>
            </thead>
            <tbody>
            {activeCategory.violations.map((violation, index) => {
                return (
                    <tr key={index}>
                        <td>{violation.severity}</td>
                        <td className="message">{violation.ruleName}: {violation.message}</td>
                        <td>{violation.line}-{violation.endLine}</td>
                        <td><a href={violation.url} target="_blank" rel="noreferrer">More Info</a></td>
                    </tr>
                )
            })}
            </tbody>
        </table>
        }
      </section>
    </div>
  );
}

export default App;
