import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquUserEntityComponent } from './acqu-user-entity.component';

describe('AcquUserEntityComponent', () => {
  let component: AcquUserEntityComponent;
  let fixture: ComponentFixture<AcquUserEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcquUserEntityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcquUserEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
