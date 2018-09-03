import {Component, OnInit} from '@angular/core';
import * as $ from 'jquery';

const carte_data = `
  204, tomates, mozzarella
  205, anchois, câpres
  206, anchois, câpres, olives
  207, jambon
  208, jambon, champignons
  209, anchois, huile de basilic, persil, huile d'olive
  210, parmesan, pancetta, oignons
  211, thon, huile de basilic, persil, câpres
  212, rucola, (copeaux de) parmesan
  213, (mélange de) fruits de mer
  214, jambon, ananas, banane
  215, jambon, artichauts, œuf (dur)
  216, poivrons, jambon, œuf (dur)
  217, champignons, asperges, artichauts, œuf (dur)
  - les gourmandes
  218, jambon, artichauts, œuf (miroir)
  219, champignons, asperges, jus de citron, ail, persil, huile d'olive
  220, jambon, viande séchée de cheval, raclette, persil
  221, filets de perche, artichauts, ail, persil, jus de citron
  222, viande séchée de cheval, salami (piquant), persil
  223, salami, pancetta, coppa, champignons
  224, mozzarella, gruyère, ricotta, gorgonzola, tomme, parmesan
  225, jambon, artichauts, asperges, olives
  226, jambon, champignons, fruits de mer, œuf (dur), olives
  227, jambon, poivrons, anchois, œuf (dur)
  228, jambon, champignons, chanterelles, olives (vertes)
  239, poivrons, merguez
  229, calzone, jambon cru, ricotta, piments
  230, calzone, jambon, jaune d’œuf, parmesan
  231, calzone, jaune d’œuf, ricotta, parmesan
  232, calzone, tomates, mozzarella, jambon, champignons
  - les sportives
  233, jambon, (2) œuf(s), parmesan
  234, chanterelles, tomme, jambon cru, ail
  235, parmesan, poivrons, œuf (dur), mortadella, salami, champignons, piments
  236, vacherin fribourgeois, gruyère, jambon, oignons
  237, artichauts, anchois, thon, ail, persil, jus de citron, piments
  238, jambon cru
  240, champignons, jambon cru, persil, ail, huile d'olive
  241, pancetta, salami (piquant), champignons, oignons
  242, jambon, champignons, oignons, poivrons, œuf (dur), thon
  243, jambon, jambon cru, coppa, mortadella, merguez, salami
  244, poulet (au curry), champignons, oignons, piments
  245, gruyère, tomme (vaudoise), champignons, chanterelles, viande séchée de cheval, olives
  246, câpres, oignons, crevettes, saumon fumé
  247, câpres, oignons, saumon fumé
  248, jambon, champignons, poivrons, merguez
  249, jambon, lard, jambon cru, champignons
  250, crevettes, thon, piments, ananas, merguez
  251, jambon, œuf (dur), merguez, poivrons, piments
  252, raclette, jambon cru, viande séchée de cheval
  253, jambon, lard, merguez, ananas, piments
  254, poulet (au curry), crevettes, ananas
  255, gruyère, lard, viande séchée de cheval, œuf (dur)
  256, jambon, lard, œuf (dur), oignons
  257, jambon, champignons, salami (piquant), olives
  - les people
  258, viande hâchée de bœuf, jambon, oignons, œuf (miroir), basilic frais
  259, artichauts, oignons, (copeaux de) parmesan, rucola
  260, jambon cru, oignons, champignons, piments
  261, jambon, champignons, poivrons, parmesan, câpres, gruyère
  262, jambon, coppa, champignons, poivrons, œuf (dur), olives
  264, fruits de mer, crevettes, jambon, oignons, champignons
  265, asperges, artichauts, poivrons, champignons
  266, pancetta, jambon, oignons, crevettes, ananas, champignons, banane
  - les politiques
  268, jambon cru, champignons, olives, oignons, artichauts, piments
  269, pancetta, coppa, jambon cru, salami, champignons, olives, asperges
  270, jambon cru, asperges, thon, œuf (dur), crevettes, ananas
  271, merguez, oignons, champignons, huile de basilic, piments
  272, thon, ananas, salami (piquant), piments
  273, thon, ananas, oignons, câpres, crevettes, huile de basilic
  274, thon, jambon, champignons, olives, piments
  275, jambon, champignons, fruits de mer, lard, oignons
  276, jambon, salami, asperges, champignons, ail
  277, gambas, ail, saumon fumé
  278, jambon cru, pancetta, mortadella, salami, crevettes, champignons, ail
  263, jambon, lard (fumé), coppa, mortadella, champignons
  279, viande hâchée de bœuf, poivrons, oignons
  281, jambon, gorgonzola, champignons, ail
  282, aubergines, jambon cru
  283, tomme, piments, ail, chanterelles
  284, lard, olives (noires), oignons
  285, gambas, ail, piments, merguez
  286, jambon, artichauts, champignons, olives, rucola
  287, crevettes, olives, oignons, ail, câpres
  288, epinards, poivrons, œuf (dur), chanterelles, champignons
  289, merguez, salami (piquant)
  290, tomates (fraîches), anchois, olives (noires), piments
  291, calzone, poulet (au curry), oignons, ananas, piments
  - les amis du Bocca
  293, oignons, câpres, ail, gambas, ananas, piments
  294, merguez, poivrons, piments, salami (piquant)
  295, jambon, pancetta, œuf (dur), olives, champignons, merguez, oignons
  296, mozzarella di bufala, tomates (fraîches), basilic frais
  297, fruits de mer, gambas, câpres, piments
  298, olives (noires), féta, artichauts, aubergines, salami, piments
  300, crevettes, piments, ananas, fruits de mer
  301, jambon cru, tomates (fraîches), parmesan, basilic frais
  302, poulet, oignons, lard(ons), rucola, (copeaux de) parmesan
`;

@Component({
  selector: 'app-boccali-carte',
  templateUrl: './boccali-carte.component.html',
  styleUrls: ['./boccali-carte.component.css'],
})
export class BoccaliCarteComponent implements OnInit {
  private allIngredients;
  private ingredientsToNo;
  private noToIngredients;
  private allNb;

  on_change(that) {
    const r = $('#recommendation')[0];
    r.innerHTML = '';

    const allInput = $(':input');
    let i = 0;

    while (i < allInput.length && !(<HTMLInputElement>allInput[i]).checked) {
      i++;
    }

    if (i === allInput.length) {
      r.innerHTML += '<div style="display: inline">Choisissez vos ingrédients ci-dessus</div>';
      return;
    }

    const ids = $('#' + allInput[i].classList[0])[0].innerText.split(',');
    let nbChecked = 1;

    i++;
    for (; i < allInput.length; i++) {
      if (!(<HTMLInputElement>allInput[i]).checked) {
        continue;
      }

      nbChecked++;
      const dv = $('#' + allInput[i].classList[0]).text().split(',');

      for (let j = 0; j < ids.length; j++) {
        if (!dv.includes(ids[j])) {
          ids.splice(j, 1);
          j--;
        }
      }
    }

    if (ids.length === 0 && nbChecked <= 6) {
      r.innerHTML += '<div style="display: inline">203, 6 ingrédients à choix</div>';
    } else {
      for (i = 0; i < ids.length; i++) {
        r.innerHTML += '<div style="display: inline">' + ids[i] + ', ' + that.noToIngredients[ids[i]] + '</div><br/>';
      }
    }
  }
  buildIngredientLists() {
    // Now process it!
    const ingDv = $('#ingredientsDiv')[0];
    ingDv.innerHTML = '';

    let len = 0;

    for (let i = 0; i < this.allIngredients.length; i++) {
      const newHtml = '<div style="white-space:nowrap; display: inline-block">' + this.allIngredients[i]
        + '&nbsp;<input class="' + this.allIngredients[i].replace(' ', '_').replace('\'', '_').replace(' ', '_').replace(' ', '_')
        + '" type="checkbox" /><div id="' + this.allIngredients[i].replace(' ', '_').replace('\'', '_').replace(' ', '_').replace(' ', '_')
        + '" style="display: none;">' + this.ingredientsToNo[this.allIngredients[i]] + '</div>&nbsp;&nbsp;';

      if (len > $('#thediv').width()) {
        ingDv.innerHTML += '<br/>';
        len = 0;
      }

      ingDv.innerHTML += newHtml;
    }

    this.on_change(this);
    $(':input').change(() => this.on_change(this));
  }
  sortByName(that) {
    that.allIngredients.sort();
    that.buildIngredientLists();
  }
  sortByFrequency(that) {
    const ingredientsToNo = that.ingredientsToNo;

    this.allIngredients.sort(function(a, b) {
      const diff = ingredientsToNo[b].length - ingredientsToNo[a].length;

      if (diff !== 0) {
        return diff;
      }

      return a.localeCompare(b);
    });

    this.buildIngredientLists();
  }
  random(that) {
    const r = $('#recommendation')[0];
    const randomNb = that.allNb[Math.floor(Math.random() * that.allNb.length)];
    r.innerHTML = '<div style="display: inline">' + randomNb + ', ' + that.noToIngredients[randomNb] + '</div><br/>';
  }
  ngOnInit() {
    document.body.style.overflowY = 'scroll';
    document.body.style.overflowX = 'hidden';

    this.allIngredients = [];
    this.ingredientsToNo = {};
    this.noToIngredients = {};
    this.allNb = [];

    $('#sortByName').click(() => this.sortByName(this));
    $('#sortByFrequency').click(() => this.sortByFrequency(this));
    $('#random').click(() => this.random(this));

    const lines = carte_data.split('\n');

    // First parse the data
    for (let i = 0 ; i < lines.length; i++) {
      if (lines[i].trim().length === 0
        || lines[i].trim()[0] === '-') {
        continue;
      }

      const elements = lines[i].trim().split(',');
      const nb = elements[0].trim();
      elements.splice(0, 1);
      // elements now contains the ingredients

      for (let j = 0; j < elements.length; j++) {
        const ingredient = elements[j].replace(/\(.*?\)/g, '').trim();

        if (!this.allIngredients.includes(ingredient)) {
          this.allIngredients.push(ingredient);
        }

        if (this.ingredientsToNo[ingredient] === undefined) {
          this.ingredientsToNo[ingredient] = [];
        }

        if (!this.ingredientsToNo[ingredient].includes(nb)) {
          this.ingredientsToNo[ingredient].push(nb);
        }
      }

      this.noToIngredients[nb] = elements.join();
      this.allNb.push(nb);
    }

    this.sortByName(this);
  }
}
