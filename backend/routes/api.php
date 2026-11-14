<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NoteController;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('notes', NoteController::class);
});
