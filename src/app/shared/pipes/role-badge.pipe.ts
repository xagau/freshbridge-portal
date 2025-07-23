import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ 
  name: 'roleBadge',
  standalone: true
})
export class RoleBadgePipe implements PipeTransform {
  transform(role: string): string {
    switch (role) {
      case 'ADMIN': 
        return 'danger'; // Red for admin (high importance)
      case 'FARMER': 
        return 'success'; // Green for farmers
      case 'RESTAURANT': 
        return 'warning'; // Orange for restaurants
      case 'USER': 
        return 'info'; // Blue for regular users
      default: 
        return 'secondary'; // Gray for unknown roles
    }
  }
}