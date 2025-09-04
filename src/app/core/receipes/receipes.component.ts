import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { RecipeService } from '../../services/recipe.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { KeyFilterModule } from 'primeng/keyfilter';
import { FileUploadModule } from 'primeng/fileupload';
import { Recipe } from '../../model/recipe';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-receipes',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './receipes.component.html',
  styleUrl: './receipes.component.scss'
})
export class ReceipesComponent implements OnInit {

  pendingRecipes: Recipe[] = [];
  recipe!: Recipe;

  
  constructor(private recipeService: RecipeService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.recipeService.recipes$.subscribe(local => {
      this.pendingRecipes = local.filter(r => r.isPending);
    });
  }

  approveRecipe(id: number) {
    this.recipeService.approveRecipe(id);
  }

  deleteRecipe(id: number) {
    this.recipeService.deleteRecipe(id);
  }
}
