import time
import unittest
from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

class WhereToGoTest(unittest.TestCase):

    def setUp(self):
        
        edge_service = Service(r"C:\WebDriver\msedgedriver.exe")
        options = webdriver.EdgeOptions()
        options.add_argument("--start-maximized")
        self.driver = webdriver.Edge(service=edge_service, options=options)
        self.base_url = "http://localhost/wheretogo/index.html"  

    def test_cargar_provincias(self):
        print("\n--- Ejecutando prueba: Carga de provincias ---")
        driver = self.driver
        driver.get(self.base_url)

        try:
        
            # 3. Esperar que aparezca el grid de provincias
            provincias_grid = WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.ID, "provincias-grid"))
            )
            cards = provincias_grid.find_elements(By.CLASS_NAME, "provincia-card")

            self.assertGreater(len(cards), 0, "No se cargaron provincias en el grid")
            print(f"✅ Provincias cargadas correctamente. Total: {len(cards)}")

        except TimeoutException as e:
            self.fail(f"❌ La prueba falló por timeout: {e}")

    def tearDown(self):
        time.sleep(4)
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
