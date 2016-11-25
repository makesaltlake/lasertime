class CreateEvents < ActiveRecord::Migration[5.0]
  def change
    create_table :events do |t|
      t.belongs_to :machine
      t.belongs_to :person

      t.integer :seconds
      t.string :mode

      t.timestamps
    end
  end
end
