import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [count, setCount] = useState(0);
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
      setFileName(contents[0]?.fileName.split('/').pop());
      setCount(contents[0].violations.length);
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
            <span>Violations for {fileName} ({count})</span> 
        }
        </div>
      </section>
      {fileName !== "Choose a File" &&
      <div>
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
      }
      {fileName === "Choose a File" &&
      <section className="help">
        <div>
          <h2>Purpose</h2>
          <p>The SFDX Code Analyzer scans Apex code for Documentation, Design, Best Practices, Security, Performance, Code Style, and Error Prone violations.  
            You will need to use a seperate tool to create the file and upload it here for ease in viewing which can be done using the instructions below.</p>
          </div>
          <div>
            <h2>Instructions: </h2>
            <ol>
              <li>Go to this <a rel="noreferrer" href="https://developer.salesforce.com/docs/atlas.en-us.packagingGuide.meta/packagingGuide/security_review_code_analyzer_scan.htm" target="_blank">Link</a>
              </li>
              <li>Follow the steps but <span class="emphasize">Except save as json instead of csv</span></li>
              <li>example: <div class="code">sfdx scanner:run --format=json --outfile=CodeAnalyzerFull.json --target="./ApexClassToRunAgainst.cls" --projectdir="./"</div></li>
              <li>Upload the saved json file at the top of this page and view the results!</li>
            </ol>
          </div>
      </section>
      }
    </div>
  );
}

export default App;
