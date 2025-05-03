
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/print.css';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
  
  // Configuration du menu déroulant mobile
  document.addEventListener('click', function(event) {
    // Cibler tous les boutons de menu déroulant
    const dropdownButtons = document.querySelectorAll('.dropdown button');
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    
    let isDropdownButton = false;
    dropdownButtons.forEach(button => {
      if (event.target === button || button.contains(event.target as Node)) {
        isDropdownButton = true;
        
        // Trouver le menu associé à ce bouton
        const menu = button.parentElement?.querySelector('.dropdown-menu');
        if (menu) {
          // Toggle le menu actuel
          menu.classList.toggle('opacity-0');
          menu.classList.toggle('invisible');
          menu.classList.toggle('-translate-y-2');
          menu.classList.toggle('scale-95');
        }
      }
    });
    
    // Si on clique ailleurs que sur un bouton dropdown, fermer tous les menus
    if (!isDropdownButton) {
      dropdownMenus.forEach(menu => {
        if (!menu.classList.contains('opacity-0')) {
          menu.classList.add('opacity-0', 'invisible', '-translate-y-2', 'scale-95');
        }
      });
    }
  });
});
