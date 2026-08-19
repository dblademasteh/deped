<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dropdown extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'description'];

    public function entries()
    {
        return $this->hasMany(DropdownEntry::class)->orderBy('sort_order');
    }

    public function activeEntries()
    {
        return $this->hasMany(DropdownEntry::class)->where('is_active', true)->orderBy('sort_order');
    }
}
