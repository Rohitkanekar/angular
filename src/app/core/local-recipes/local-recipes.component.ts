import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../model/recipe';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { RecipeService } from '../../services/recipe.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-local-recipes',
  imports: [CardModule, CommonModule, TabsModule, FileUploadModule, DialogModule, ButtonModule, FormsModule, ReactiveFormsModule, AutoCompleteModule, InputTextModule],
  templateUrl: './local-recipes.component.html',
  styleUrl: './local-recipes.component.scss'
})
export class LocalRecipesComponent implements OnInit {

  pendingRecipes: Recipe[] = [];
  approvedRecipes: Recipe[] = [];
  onlineRecipes: any[] = [];
  recipesFormVisible = false;
  recipeForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  tagItems: string[] = [];

  localRecipes: any[] = [];
  newRecipes: Recipe[] = [];
  newRecipeId: number = 1000;
  newUserId: number = 1000;
  uploadedFiles :any[] = [];

  constructor(private recipeService: RecipeService, private fb: FormBuilder) {

  }

  ngOnInit(): void {

    this.initializeForm();
    console.log('Pending recipe', this.pendingRecipes);

    // subscribe to local recipes changes
    this.recipeService.recipes$.subscribe((local) => {
      this.pendingRecipes = local.filter(r => r.isPending);
      this.approvedRecipes = local.filter(r => !r.isPending);
    });

    // Pending Receipes
    const savedData = localStorage.getItem('localRecipes');
    if (savedData) {
      const allLocal = JSON.parse(savedData);
      this.localRecipes = allLocal.filter((r: Recipe) => r.isPending); // Only pending for admin
      this.newRecipes = [...this.localRecipes];
    } else {
      this.localRecipes = [];
      this.newRecipes = [];
    }


    // Approved Receipes
    const data = localStorage.getItem('localRecipes');
    if (data) {
      const allRecipes = JSON.parse(data);
      this.approvedRecipes = allRecipes.filter((r: Recipe) => !r.isPending);
    } else {
      this.approvedRecipes = [];
    }
    console.log('Local Approved Recipes', this.approvedRecipes);

    // Online Receipes
    this.recipeService.getAllRecipes().subscribe({
      next: (data: any) => {
        this.onlineRecipes = data.recipes || [];
        console.log('Online Receipes', this.onlineRecipes);
      },
      error: (e) => {
        console.error("Error fetching recipes:", e);
      }
    });
  }

  initializeForm(): void {
    this.recipeForm = this.fb.group({
      // id: [this.newRecipeId],
      // userId: [this.newUserId],
      name: ['', Validators.required],
      cuisine: ['', Validators.required],
      caloriesPerServing: ['', [Validators.required]],
      cookTimeMinutes: ['', [Validators.required]],
      prepTimeMinutes: ['', [Validators.required]],
      difficulty: ['', Validators.required],
      servings: ['', [Validators.required]],
      tags: ['', Validators.required],
      image: ['']
    });
  }

  addRecipes() {
    this.recipesFormVisible = true;
  }

  onSubmit() {
    if (!this.recipeForm.valid) {
      this.recipeForm.markAllAsTouched();
      return;
    }

    const formValues = this.recipeForm.value;
    const newRecipe: Recipe = {
      id: this.newRecipeId++,
      userId: this.newUserId++,
      name: formValues.name,
      cuisine: formValues.cuisine,
      caloriesPerServing: Number(formValues.caloriesPerServing),
      cookTimeMinutes: Number(formValues.cookTimeMinutes),
      prepTimeMinutes: Number(formValues.prepTimeMinutes),
      difficulty: formValues.difficulty,
      servings: Number(formValues.servings),
      tags: formValues.tags,
      image: formValues.image || this.imagePreview as string || null,
      isPending: true,
      // ingredients: formValues.ingredients || [],
      // instructions: formValues.instructions || []
    };

    this.recipeService.addPendingRecipe(newRecipe);

    // reset
    this.recipeForm.reset();
    this.recipeForm.patchValue({ tags: [] });
    this.imagePreview = null;
    this.recipesFormVisible = false;
  }

  sortRecipesByIdDesc() {
    this.newRecipes.sort((a, b) => Number(b.id) - Number(a.id));
  }

  onImageSelected(event: any) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
      this.recipeForm.patchValue({ image: reader.result });
    };
    reader.readAsDataURL(file);

    input.value = ''; // allow re-selecting same file
  }

  onTagsType(event: AutoCompleteCompleteEvent) {
    this.tagItems = [...Array(10).keys()].map((item) => event.query + '-' + item);
  }

  get allRecipes(): any[] {
    // merge approved local + online recipes
    return [...this.approvedRecipes, ...this.onlineRecipes];
  }

  get formControls() {
    return {
      id: this.recipeForm.get('id'),
      userId: this.recipeForm.get('userId'),
      name: this.recipeForm.get('name'),
      cuisine: this.recipeForm.get('cuisine'),
      caloriesPerServing: this.recipeForm.get('caloriesPerServing'),
      cookTimeMinutes: this.recipeForm.get('cookTimeMinutes'),
      prepTimeMinutes: this.recipeForm.get('prepTimeMinutes'),
      difficulty: this.recipeForm.get('difficulty'),
      rating: this.recipeForm.get('rating'),
      reviewCount: this.recipeForm.get('reviewCount'),
      servings: this.recipeForm.get('servings'),
      tags: this.recipeForm.get('tags'),
      image: this.recipeForm.get('image')
    };
  }



}
