<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DropdownEntry extends Model
{
    use HasFactory;

    protected $fillable = ['dropdown_id', 'label', 'value', 'sort_order', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function dropdown()
    {
        return $this->belongsTo(Dropdown::class);
    }
}
