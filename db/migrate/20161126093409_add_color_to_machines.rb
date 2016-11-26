class AddColorToMachines < ActiveRecord::Migration[5.0]
  def change
    add_column :machines, :color, :string
  end
end
