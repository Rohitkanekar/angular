import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalRecipesComponent } from './local-recipes.component';

describe('LocalRecipesComponent', () => {
  let component: LocalRecipesComponent;
  let fixture: ComponentFixture<LocalRecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalRecipesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
