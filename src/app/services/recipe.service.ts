import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../model/recipe';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'any',
})
export class RecipeService {

  private localRecipesKey = 'localRecipes';
  private recipesSubject = new BehaviorSubject<Recipe[]>(this.getLocalRecipes());
  public recipes$ = this.recipesSubject.asObservable();
  
  constructor(private http: HttpClient) { }

  public getAllRecipes() {
    return this.http.get('https://dummyjson.com/recipes');
  }

  // public addRecipe() {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });
  //   return this.http.post('https://dummyjson.com/recipes/add', JSON.stringify({
  //     name: 'Peri Noodles'
  //   }), { headers });
  // }

  private loadFromStorage(): Recipe[] {
    try {
      return JSON.parse(localStorage.getItem(this.localRecipesKey) || '[]') as Recipe[];
    } catch {
      return [];
    }
  }

   private saveToStorage(recipes: Recipe[]) {
    localStorage.setItem(this.localRecipesKey, JSON.stringify(recipes));
    this.recipesSubject.next(recipes);
  }

  getLocalRecipes(): Recipe[] {
    return this.loadFromStorage();
  }

  // getLocalRecipes(): Recipe[] {
  //   return JSON.parse(localStorage.getItem(this.localRecipesKey) || '[]');
  // }

  addPendingRecipe(recipe: Recipe) {
    const recipes = this.loadFromStorage();
    recipes.push(recipe);
    this.saveToStorage(recipes);
  }

  saveLocalRecipes(recipes: Recipe[]): void {
    localStorage.setItem(this.localRecipesKey, JSON.stringify(recipes));
    this.recipesSubject.next(recipes);
  }

  // addPendingRecipe(recipe: Recipe): void {
  //   const recipes = this.getLocalRecipes();
  //   recipes.push(recipe);
  //   this.saveLocalRecipes(recipes);
  // }

  
  approveRecipe(id: number) {
    const recipes = this.loadFromStorage();
    const idx = recipes.findIndex(r => r.id === id);
    if (idx !== -1) {
      recipes[idx].isPending = false;
      this.saveToStorage(recipes);
    }
  }

  deleteRecipe(id: number) {
    const recipes = this.loadFromStorage().filter(r => r.id !== id);
    this.saveToStorage(recipes);
  }

}
