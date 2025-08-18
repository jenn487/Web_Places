from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.service import Service as EdgeService
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.common.exceptions import WebDriverException, NoSuchElementException, TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


EDGE_DRIVER_PATH = 'C:/WebDriver/msedgedriver.exe'  

PROJECT_URL = 'http://localhost/wheretogo/index.html'


edge_options = EdgeOptions()

service = EdgeService(EDGE_DRIVER_PATH)

print("Iniciando pruebas de WhereToGo con Microsoft Edge...")

def run_tests():
    try:
        driver = webdriver.Edge(service=service, options=edge_options)
        driver.maximize_window()
        test_cargar_provincias(driver)
    except WebDriverException as e:
        print(f"\n[ERROR] No se pudo iniciar Edge WebDriver. Verifica la ruta y compatibilidad.")
        print(f"Detalles: {e}")
        time.sleep(0.5)
    finally:
        if 'driver' in locals() and driver:
            print("\nCerrando navegador.")
            driver.quit()

def test_cargar_provincias(driver):
    print("\n--- Ejecutando Caso de Prueba 1: Carga de Provincias ---")
    try:
        driver.get(PROJECT_URL)

        loading_message = driver.find_element(By.ID, "loading")
        assert "block" in loading_message.get_attribute("style"), "El mensaje de carga no es visible al inicio."
        print("✔ Paso 1: El mensaje de carga es visible.")

        wait = WebDriverWait(driver, 10)
        provincias_grid = wait.until(EC.visibility_of_element_located((By.ID, "provincias-grid")))
        assert "grid" in provincias_grid.get_attribute("style"), "La cuadrícula de provincias no se mostró."
        print("✔ Paso 2: La cuadrícula de provincias es visible.")

        time.sleep(1)
        loading_message_style = driver.find_element(By.ID, "loading").get_attribute("style")
        assert "none" in loading_message_style or "hidden" in loading_message_style, "El mensaje de carga sigue visible."
        print("✔ Paso 3: El mensaje de carga ya no es visible.")

        error_message = driver.find_element(By.ID, "error-message")
        assert "none" in error_message.get_attribute("style"), "El mensaje de error es visible."
        print("✔ Paso 4: El mensaje de error no es visible.")

        provincias_cards = driver.find_elements(By.CLASS_NAME, "provincia-card")
        assert len(provincias_cards) > 0, "No se encontraron tarjetas de provincia."
        print(f"✔ Paso 5: Se encontraron {len(provincias_cards)} tarjetas de provincia. Prueba exitosa.")

    except (NoSuchElementException, TimeoutException, AssertionError) as e:
        print(f"❌ La prueba falló. Error: {e}")
        driver.save_screenshot("error_test_cargar_provincias.png")
    except Exception as e:
        print(f"❌ Ocurrió un error inesperado: {e}")

if __name__ == "__main__":
    run_tests()
